/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import MapWorkspace from './pages/MapWorkspace';
import ReviewQueue from './pages/ReviewQueue';
import ChangeDetection from './pages/ChangeDetection';
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

  const handleNavigateToConflict = (c: Conflict) => {
    setActiveTab('map');
    // In a real app we'd pass the selected conflict to the map workspace via state/context
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
      {['conflicts', 'settings'].includes(activeTab) && (
        <div className="w-full h-full flex flex-col items-center justify-center text-stone-600 bg-stone-50 p-8">
           <div className="text-2xl font-bold text-stone-600 mb-2 capitalize">{activeTab} View</div>
           <p className="max-w-md text-center text-sm">
             This is a prototype demonstration. The core functionality is implemented in the 
             <button onClick={()=>setActiveTab('map')} className="text-emerald-600 font-medium hover:underline mx-1">Map Workspace</button> 
             and 
             <button onClick={()=>setActiveTab('review')} className="text-emerald-600 font-medium hover:underline mx-1">Review Queue</button>.
           </p>
        </div>
      )}
    </AppShell>
  );
}
