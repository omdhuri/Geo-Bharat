/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import ImportModal from './components/ImportModal';
import MapWorkspace from './pages/MapWorkspace';
import ReviewQueue from './pages/ReviewQueue';
import ChangeDetection from './pages/ChangeDetection';
import Settings from './pages/Settings';
import { GeoFeature, Conflict, Change, ProjectStats } from './types';
import { runAnalysis } from './services/aiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  
  // Global State
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [searchMarker, setSearchMarker] = useState<{lat: number, lon: number, label: string} | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [initialConflictId, setInitialConflictId] = useState<string | null>(null);
  const [initialAction, setInitialAction] = useState<'view' | 'edit' | null>(null);

  useEffect(() => {
    // Load initial demo state
    runAnalysis(true).then(result => {
      setFeatures(result.features);
      setConflicts(result.conflicts);
      setChanges(result.changes);
      setStats(result.stats);
    });
  }, []);

  const handleSearch = async (query: string) => {
    if (!query) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setSearchMarker({ lat: parseFloat(lat), lon: parseFloat(lon), label: display_name });
      }
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const handleNavigateToConflict = (c: Conflict, action: 'view' | 'edit' = 'view') => {
    setInitialConflictId(c.id);
    setInitialAction(action);
    setActiveTab('map');
  };

  const handleResolveConflict = (id: string, status: 'resolved') => {
    setConflicts(prev => prev.filter(c => c.id !== id));
    if (stats) {
      setStats({
        ...stats,
        pendingReviews: Math.max(0, stats.pendingReviews - 1),
        totalConflicts: Math.max(0, stats.totalConflicts - 1)
      });
    }
  };

  return (
    <AppShell 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      pendingReviewsCount={conflicts.length}
      onSearch={handleSearch}
      onImportClick={() => setShowImportModal(true)}
    >
      {(activeTab === 'map' || activeTab === 'layers') && (
        <MapWorkspace 
          features={features}
          setFeatures={setFeatures}
          conflicts={conflicts}
          setConflicts={setConflicts}
          changes={changes}
          setChanges={setChanges}
          stats={stats}
          setStats={setStats}
          onOpenReview={() => setActiveTab('review')}
          isLayersTabMobile={activeTab === 'layers'}
          mapCenter={mapCenter}
          searchMarker={searchMarker}
          initialConflictId={initialConflictId}
          initialAction={initialAction}
          clearInitialConflict={() => {
            setInitialConflictId(null);
            setInitialAction(null);
          }}
        />
      )}
      
      {activeTab === 'review' && (
        <ReviewQueue 
          conflicts={conflicts}
          changes={changes}
          onNavigateToConflict={handleNavigateToConflict}
          onResolveConflict={handleResolveConflict}
        />
      )}

      {activeTab === 'changes' && (
        <ChangeDetection changes={changes} />
      )}

      {/* Placeholder for other tabs */}
            {activeTab === 'settings' && <Settings />}
            {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />}
    </AppShell>
  );
}
