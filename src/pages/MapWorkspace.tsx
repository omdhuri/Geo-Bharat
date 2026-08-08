import React, { useState, useRef, useEffect } from 'react';
import GISMap from '../components/map/MapContainer';
import { runAnalysis } from '../services/aiService';
import { GeoFeature, Conflict, Change, ProjectStats, Position } from '../types';
import { Layers, Play, CheckCircle2, AlertTriangle, Eye, EyeOff, Loader2, Maximize, Minimize, Check, X, ShieldAlert, ChevronRight, Activity, Download, Layout, PenTool, Undo } from 'lucide-react';
import { cn, formatArea, getConfidenceColor } from '../utils';

export default function MapWorkspace({
  features,
  setFeatures,
  conflicts,
  setConflicts,
  changes,
  setChanges,
  stats,
  setStats,
  onOpenReview,
  isLayersTabMobile,
  mapCenter: initialMapCenter,
  searchMarker,
  initialConflictId,
  initialAction,
  clearInitialConflict
}: {
  initialConflictId?: string | null;
  initialAction?: 'view' | 'edit' | null;
  clearInitialConflict?: () => void;
  features: GeoFeature[],
  setFeatures: React.Dispatch<React.SetStateAction<GeoFeature[]>>,
  conflicts: Conflict[],
  setConflicts: React.Dispatch<React.SetStateAction<Conflict[]>>,
  changes: Change[],
  setChanges: React.Dispatch<React.SetStateAction<Change[]>>,
  stats: ProjectStats | null,
  setStats: React.Dispatch<React.SetStateAction<ProjectStats | null>>,
  onOpenReview: () => void,
  isLayersTabMobile?: boolean,
  mapCenter?: [number, number],
  searchMarker?: {lat: number, lon: number, label: string} | null
}) {
  
  const [isTracing, setIsTracing] = useState(false);
  const isTracingRef = useRef(isTracing);
  useEffect(() => { isTracingRef.current = isTracing; }, [isTracing]);
  const [tracingPoints, setTracingPoints] = useState<[number, number][]>([]);
  const [drawType, setDrawType] = useState<GeoFeature['type']>('farm');
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);


  const handlePointMove = (index: number, latlng: [number, number]) => {
    setTracingPoints(prev => {
      const newPts = [...prev];
      newPts[index] = latlng;
      return newPts;
    });
  };
  
  const handlePointDelete = (index: number) => {
    setTracingPoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleMapClick = (latlng: [number, number]) => {
    if (isTracingRef.current) {
      setTracingPoints(prev => [...prev, latlng]);
    }
  };

  const undoTracing = () => {
    setTracingPoints(prev => prev.slice(0, -1));
  };

  const finishTracing = () => {
    if (tracingPoints.length >= 3) {
      if (editingFeatureId) {
        setFeatures(features.map(f => f.id === editingFeatureId ? {
          ...f,
          type: drawType,
          geometry: {
            ...f.geometry,
            type: 'Polygon',
            coordinates: [tracingPoints]
          }
        } : f));
        setEditingFeatureId(null);
      } else {
        const newFeature: GeoFeature = {
          id: `feature-${Date.now()}`,
          type: drawType,
          geometry: {
            type: 'Polygon',
            coordinates: [tracingPoints]
          },
          confidence: 100,
          status: 'accepted',
          source: 'manual',
          createdAt: new Date().toISOString()
        };
        setFeatures([...features, newFeature]);
      }
      setTracingPoints([]);
      setIsTracing(false);
    } else {
      alert('Need at least 3 points to form a polygon');
    }
  };

  const cancelTracing = () => {
    setTracingPoints([]);
    setIsTracing(false);
    setEditingFeatureId(null);
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  
  const [visibleLayers, setVisibleLayers] = useState({
    farms: true,
    buildings: true,
    roads: true,
    trees: true,
    water: true,
    conflicts: true,
    labels: true
  });

  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([17.6805, 74.0183]);
  
  useEffect(() => {
    if (initialMapCenter) {
      setMapCenter(initialMapCenter);
    }
  }, [initialMapCenter]);

  useEffect(() => {
    if (initialConflictId && conflicts.length > 0) {
      const conflict = conflicts.find(c => c.id === initialConflictId);
      if (conflict) {
        setSelectedConflict(conflict);
        if (conflict.geometry.type === 'Point') {
          setMapCenter(conflict.geometry.coordinates as [number, number]);
        } else {
          setMapCenter(conflict.geometry.coordinates[0][0] as [number, number]);
        }
        
        if (initialAction === 'edit') {
          // Enter edit mode
          const featureId = conflict.affectedFeatureIds[0];
          const feature = features.find(f => f.id === featureId);
          if (feature) {
            setEditingFeatureId(feature.id);
            setDrawType(feature.type);
            if (feature.geometry.type === 'Polygon') {
              setTracingPoints(feature.geometry.coordinates[0] as [number, number][]);
            }
            setIsTracing(true);
            setSelectedConflict(null);
          }
        }
      }
      if (clearInitialConflict) clearInitialConflict();
    }
  }, [initialConflictId, initialAction, conflicts, features, clearInitialConflict]);
  const [showExport, setShowExport] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    
    // Simulate steps
    const steps = setInterval(() => {
      setAnalysisStep(s => {
        if (s >= 9) {
          clearInterval(steps);
          return s;
        }
        return s + 1;
      });
    }, 200);

    const result = await runAnalysis();
    setFeatures(result.features);
    setConflicts(result.conflicts);
    setChanges(result.changes);
    setStats(result.stats);
    
    clearInterval(steps);
    setAnalysisStep(10);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleFeatureSelect = (f: GeoFeature | null) => {
    setSelectedFeature(f);
    setSelectedConflict(null);
  };

  const handleConflictSelect = (c: Conflict | null) => {
    setSelectedConflict(c);
    setSelectedFeature(null);
    if (c) {
       setMapCenter(c.geometry.coordinates as [number, number]);
    }
  };

  const resolveConflict = (id: string, status: 'resolved') => {
    setConflicts(prev => prev.filter(c => c.id !== id));
    setSelectedConflict(null);
    if (stats) {
      setStats({
        ...stats,
        pendingReviews: Math.max(0, stats.pendingReviews - 1),
        totalConflicts: Math.max(0, stats.totalConflicts - 1)
      });
    }
  };

  return (
    <div className="w-full h-full relative flex">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <GISMap 
          features={features.filter(f => f.id !== editingFeatureId)} 
          conflicts={conflicts} 
          changes={changes}
          visibleLayers={visibleLayers}
          onFeatureSelect={handleFeatureSelect}
          onConflictSelect={handleConflictSelect}
          selectedFeatureId={selectedFeature?.id || null}
          selectedConflictId={selectedConflict?.id || null}
          mapCenter={mapCenter}
            searchMarker={searchMarker}
          isTracing={isTracing}
          tracingPoints={tracingPoints}
          onMapClick={handleMapClick}
          onPointMove={handlePointMove}
          onPointDelete={handlePointDelete}
        />
      </div>

      {/* Floating Header */}
      <div className={cn(
        "absolute inset-0 pointer-events-none z-10 transition-all duration-300",
        isLayersTabMobile ? "opacity-0 md:opacity-100" : "opacity-100"
      )}>
        
        {/* Project Context */}
        <div className={cn(
          "absolute top-2 left-2 md:top-4 md:left-4",
          "bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg p-2 md:p-3 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-6 transition-all duration-300 lg:w-auto max-w-[calc(100vw-110px)] md:max-w-[75vw]",
          (!showOverlays || isLayersTabMobile) ? "pointer-events-none md:pointer-events-auto" : "pointer-events-auto",
          (!showOverlays || isTracing) && "opacity-0 -translate-y-4 pointer-events-none"
        )}>
          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold text-stone-900 whitespace-nowrap">Satara District — Pilot Survey</h2>
            <div className="text-xs text-stone-600 mt-0.5 flex items-center gap-2">
              <span>Mar 2026 Imagery</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span>48.7 km²</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              {stats ? (
                <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Analysis Complete</span>
              ) : (
                <span className="text-amber-700">Ready for Analysis</span>
              )}
            </div>
          </div>
          
          <div className="sm:hidden flex flex-col">
            <h2 className="text-xs font-semibold text-stone-900 truncate">Satara Pilot</h2>
            {stats ? (
               <span className="text-emerald-700 text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>
            ) : (
               <span className="text-amber-700 text-[10px]">Ready</span>
            )}
          </div>
          
          <div className="h-8 w-px bg-stone-200/50 hidden sm:block" />
          
          <div className="flex flex-col gap-1.5 sm:gap-2 min-w-[120px]">
            <button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-200 text-white disabled:text-stone-600 text-[10px] md:text-xs font-bold px-2 py-1.5 md:px-4 md:py-2 rounded shadow transition-all active:scale-95 flex items-center justify-center gap-1 md:gap-2 shrink-0 w-full"
            >
              {isAnalyzing ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin shrink-0" /> : <Play className="w-3 h-3 md:w-4 md:h-4 fill-current shrink-0" />}
              <span className="hidden sm:inline">{isAnalyzing ? 'PROCESSING...' : 'RUN AI ANALYSIS'}</span>
              <span className="sm:hidden">{isAnalyzing ? 'WAIT' : 'RUN'}</span>
            </button>
            {stats && (
               <button 
                 onClick={() => setShowExport(true)}
                 className="bg-stone-100 hover:bg-stone-200 border border-stone-400 text-stone-900 text-[10px] md:text-xs font-bold px-2 py-1.5 md:px-4 md:py-2 rounded shadow transition-colors flex items-center justify-center gap-1 md:gap-2 w-full"
               >
                 <Download className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> <span className="hidden sm:inline">EXPORT</span>
               </button>
            )}
          </div>
        </div>

        {/* Right side controls */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-start gap-1 md:gap-2 shrink-0">
          <div className={cn(
            "flex gap-1 md:gap-2 transition-all duration-300",
            (!showOverlays || isLayersTabMobile) ? "pointer-events-none md:pointer-events-auto" : "pointer-events-auto",
            !showOverlays && "opacity-0 -translate-y-4"
          )}>
            
            {/* Trace Toggle */}
            <button
              onClick={() => {
                if (isTracing) {
                  cancelTracing();
                } else {
                  setIsTracing(true);
                  setTracingPoints([]);
                  setSelectedFeature(null);
                  setSelectedConflict(null);
                }
              }}
              className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg transition-all flex items-center justify-center shrink-0",
                isTracing 
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
                  : "bg-white/80 backdrop-blur-md border border-stone-300/50 text-stone-800 hover:text-stone-900"
              )}
              title={isTracing ? 'Cancel Tracing' : 'Trace Feature'}
            >
              {isTracing ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <PenTool className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
          </div>

          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={cn(
               "bg-white/80 backdrop-blur-md border border-stone-300/50 w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg text-stone-800 hover:text-stone-900 transition-all flex items-center justify-center shrink-0",
               (!showOverlays || isLayersTabMobile) ? "pointer-events-none md:pointer-events-auto" : "pointer-events-auto",
               !showOverlays && "bg-stone-100/90 border-emerald-600/50 text-emerald-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            )}
            title={showOverlays ? "Hide UI Panels" : "Show UI Panels"}
          >
            {showOverlays ? <Minimize className="w-4 h-4 md:w-5 md:h-5" /> : <Layout className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      </div>

      
      {/* Bottom Right Stats */}
      {stats && showOverlays && !isLayersTabMobile && !selectedFeature && !selectedConflict && !isTracing && (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 flex flex-col gap-2 pointer-events-auto">
          <div className="bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg px-2 py-1 md:px-3 md:py-2 shadow-lg flex items-center justify-between gap-1.5 md:gap-3 h-10 md:h-12">
            <div className="flex items-center gap-1.5 md:gap-2">
               <span className="text-[8px] md:text-[10px] whitespace-nowrap uppercase tracking-wider text-stone-600 font-semibold">Reviews</span>
               <div className="flex items-center gap-1 text-rose-700">
                 <ShieldAlert className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                 <span className="text-xs md:text-sm font-bold leading-none">{stats.pendingReviews}</span>
               </div>
            </div>
            <button onClick={onOpenReview} className="text-[9px] md:text-[10px] text-emerald-600 hover:text-emerald-300 font-medium whitespace-nowrap border-l border-stone-300 pl-2 md:pl-3">Open Queue →</button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg px-2 py-1 md:px-3 md:py-2 shadow-lg flex items-center justify-between gap-1.5 md:gap-2 h-10 md:h-12">
             <span className="text-[8px] md:text-[10px] whitespace-nowrap uppercase tracking-wider text-stone-600 font-semibold">Extracted</span>
             <div className="flex items-center gap-1 text-emerald-700">
               <Layers className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
               <span className="text-xs md:text-sm font-bold leading-none">{stats.totalFeatures}</span>
             </div>
          </div>
        </div>
      )}


      {/* Export Modal */}
      {showExport && (
        <div className="absolute inset-0 bg-stone-50/60 backdrop-blur-sm z-[100] flex items-center justify-center pointer-events-auto">
          <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-[400px] overflow-hidden">
             <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-100/30">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-600" /> Export GIS Data
                </h3>
                <button onClick={() => setShowExport(false)} className="text-stone-600 hover:text-stone-900"><X className="w-5 h-5"/></button>
             </div>
             
             <div className="p-4 space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Select Layers</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Farm Boundaries', 'Buildings', 'Roads', 'Trees', 'Water Bodies', 'LULC', 'Conflicts'].map(l => (
                      <label key={l} className="flex items-center gap-2 text-sm text-stone-800">
                        <input type="checkbox" defaultChecked className="rounded border-stone-300 bg-stone-100 text-emerald-600 focus:ring-emerald-500" />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Export Format</div>
                  <select className="w-full bg-stone-100 border border-stone-300 rounded-md p-2 text-sm text-stone-900 focus:outline-none focus:border-emerald-600">
                    <option>GeoJSON (.geojson)</option>
                    <option>Shapefile (.shp)</option>
                    <option>GeoPackage (.gpkg)</option>
                    <option>File Geodatabase (.gdb)</option>
                  </select>
                </div>
                
                <div>
                   <label className="flex items-center gap-2 text-sm text-stone-800">
                     <input type="checkbox" defaultChecked className="rounded border-stone-300 bg-stone-100 text-emerald-600 focus:ring-emerald-500" />
                     Include AI Confidence metadata
                   </label>
                </div>
             </div>

             <div className="p-4 border-t border-stone-200 bg-stone-100/30 flex justify-end gap-2">
                <button onClick={() => setShowExport(false)} className="px-4 py-2 text-sm font-bold text-stone-800 hover:text-stone-900 transition-colors">Cancel</button>
                <button 
                  onClick={() => {
                    setExporting(true);
                    setTimeout(() => {
                      setExporting(false);
                      setShowExport(false);
                      alert('Export generated successfully.');
                    }, 1500);
                  }}
                  disabled={exporting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded shadow transition-colors flex items-center gap-2"
                >
                  {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {exporting ? 'Generating...' : 'Generate Export'}
                </button>
             </div>
          </div>
        </div>
      )}

      
      {isTracing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-stone-200 p-1.5 flex gap-1 items-center">
             <div className="relative flex items-center border-r border-stone-200">
               <select 
                 value={drawType} 
                 onChange={e => setDrawType(e.target.value as any)}
                 className="bg-transparent text-sm font-bold text-stone-700 outline-none pl-3 pr-7 py-1 cursor-pointer appearance-none relative z-10 w-full"
               >
                 <option value="farm">Farm</option>
                 <option value="building">Building</option>
                 <option value="road">Road</option>
                 <option value="water">Water</option>
                 <option value="tree">Tree</option>
                 <option value="lulc">LULC</option>
               </select>
               <div className="absolute right-2 text-stone-500 pointer-events-none z-0">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
               </div>
             </div>
             
             <div className="px-3 py-1 text-xs font-medium text-stone-500 border-r border-stone-200">
               {tracingPoints.length} points
             </div>
             
             <div className="text-[10px] text-stone-500 mr-2 whitespace-nowrap hidden sm:block">
               Drag points to move. Right-click to remove.
             </div>
             <button 
               onClick={undoTracing} 
               disabled={tracingPoints.length === 0}
               className="p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               title="Undo last point"
             >
               <Undo className="w-4 h-4" />
             </button>
             
             <button 
               onClick={cancelTracing} 
               className="px-4 py-1.5 text-stone-600 font-medium hover:bg-stone-100 hover:text-stone-900 rounded-full transition-colors text-sm"
             >
               Cancel
             </button>
             
             <button 
               onClick={finishTracing} 
               disabled={tracingPoints.length < 3}
               className={cn("px-4 py-1.5 rounded-full text-sm font-bold text-white transition-all", tracingPoints.length >= 3 ? "bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20" : "bg-emerald-600/50 cursor-not-allowed")}
             >
               Complete
             </button>
           </div>
           
           {tracingPoints.length < 3 && (
             <div className="bg-stone-900/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
               Click on map to add {3 - tracingPoints.length} more {3 - tracingPoints.length === 1 ? 'point' : 'points'}
             </div>
           )}
        </div>
      )}

      {/* Analysis Progress Modal */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-stone-50/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white border border-stone-300 p-6 rounded-xl shadow-2xl w-96">
            <h3 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              AI Geospatial Extraction
            </h3>
            
            <div className="space-y-3 text-sm">
              {[
                'Loading orthophoto tiles',
                'Preprocessing imagery',
                'Building footprints extraction',
                'Road centerline detection',
                'Farm boundary delineation',
                'Tree detection & counting',
                'Water body classification',
                'Spatial conflict analysis',
                'Confidence scoring'
              ].map((step, idx) => (
                <div key={idx} className={cn(
                  "flex items-center gap-3 transition-opacity duration-300",
                  analysisStep > idx ? "text-emerald-700" : 
                  analysisStep === idx ? "text-emerald-600" : "text-stone-600 opacity-50"
                )}>
                  {analysisStep > idx ? <CheckCircle2 className="w-4 h-4" /> : 
                   analysisStep === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                   <div className="w-4 h-4 rounded-full border border-stone-400" />}
                  <span className="font-medium">{step}</span>
                </div>
              ))}
            </div>

            {analysisStep === 10 && (
              <div className="mt-6 pt-4 border-t border-stone-200 text-center text-emerald-700 font-bold animate-pulse">
                Analysis Complete
              </div>
            )}
          </div>
        </div>
      )}

      {/* Left Data/Layer Panel */}
      <div className={cn(
        "absolute flex flex-col gap-4 z-10 transition-all duration-300",
        isLayersTabMobile 
          ? "inset-0 p-4 pb-20 pointer-events-auto bg-stone-50/90 backdrop-blur md:bg-transparent md:backdrop-blur-none md:p-0 md:inset-auto md:top-28 md:left-4 md:max-h-[calc(100vh-9rem)] md:w-64 md:pointer-events-none" 
          : "hidden",
        (!showOverlays || isTracing) && "opacity-0 -translate-x-8 pointer-events-none"
      )}>
        <div className="bg-white/90 backdrop-blur-md border border-stone-300/50 rounded-xl md:rounded-lg shadow-xl pointer-events-auto flex flex-col overflow-hidden max-h-full">
          <div className="p-3 border-b border-stone-200 bg-stone-100/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Data Layers
            </h3>
          </div>
          
          <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
            <LayerToggle label="Map Labels" color="bg-stone-500" active={visibleLayers.labels} onToggle={() => toggleLayer('labels')} />
            <LayerToggle label="Farm Boundaries" color="bg-green-500" count={features.filter(f=>f.type==='farm').length} active={visibleLayers.farms} onToggle={() => toggleLayer('farms')} />
            <LayerToggle label="Buildings" color="bg-emerald-600" count={features.filter(f=>f.type==='building').length} active={visibleLayers.buildings} onToggle={() => toggleLayer('buildings')} />
            <LayerToggle label="Road Networks" color="bg-stone-300" count={features.filter(f=>f.type==='road').length} active={visibleLayers.roads} onToggle={() => toggleLayer('roads')} />
            <LayerToggle label="Trees" color="bg-emerald-400" count={features.filter(f=>f.type==='tree').length} active={visibleLayers.trees} onToggle={() => toggleLayer('trees')} />
            <LayerToggle label="Water Bodies" color="bg-emerald-500" count={features.filter(f=>f.type==='water').length} active={visibleLayers.water} onToggle={() => toggleLayer('water')} />
            
            <div className="my-2 h-px bg-stone-100" />
            
            <LayerToggle label="Spatial Conflicts" color="bg-rose-500" count={conflicts.length} active={visibleLayers.conflicts} onToggle={() => toggleLayer('conflicts')} warning />
          </div>
        </div>
      </div>

      {/* Right Inspector Panel */}
      <div className={cn(
        "absolute pointer-events-none z-20 flex flex-col gap-4 transition-all duration-300",
        "bottom-0 left-0 right-0 p-2 md:p-0 md:bottom-4 md:top-28 md:left-auto md:right-4 md:w-72 xl:w-80",
        isLayersTabMobile ? "opacity-0 md:opacity-100 translate-y-10 md:translate-y-0 pointer-events-none" : "opacity-100 translate-y-0",
        (!showOverlays || isTracing) && "opacity-0 translate-x-8 pointer-events-none"
      )}>
        
        {selectedConflict && (
          <div className="bg-white/95 backdrop-blur-md border border-rose-900/50 shadow-[0_-10px_30px_rgba(225,29,72,0.1)] lg:shadow-[0_0_30px_rgba(225,29,72,0.1)] rounded-t-xl lg:rounded-lg pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-8 lg:slide-in-from-right-8 duration-200 max-h-[50vh] lg:max-h-full overflow-y-auto custom-scrollbar flex shrink-0 flex-col">
             <div className="bg-rose-100 p-3 lg:p-4 border-b border-rose-500/20 flex justify-between items-start sticky top-0 backdrop-blur-md z-10">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <ShieldAlert className="w-4 h-4 text-rose-500" />
                   <h3 className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-rose-700">Potential Conflict</h3>
                 </div>
                 <div className="text-stone-900 font-mono text-base lg:text-lg">{selectedConflict.id}</div>
               </div>
               <button onClick={() => setSelectedConflict(null)} className="text-stone-600 hover:text-stone-900"><X className="w-5 h-5"/></button>
             </div>
             <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-600 font-semibold mb-1">Conflict Type</div>
                  <div className="text-xs lg:text-sm font-medium text-stone-900">{selectedConflict.description}</div>
                </div>
                
                <div className="flex gap-2 lg:gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex-1 min-w-[45%] bg-stone-100/50 rounded p-2 border border-stone-300/50">
                    <div className="text-[8px] lg:text-[10px] uppercase tracking-wider text-stone-600 mb-1">AI Confidence</div>
                    <div className={cn("text-sm lg:text-lg font-bold", getConfidenceColor(selectedConflict.confidence))}>
                      {selectedConflict.confidence.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex-1 min-w-[45%] bg-stone-100/50 rounded p-2 border border-stone-300/50">
                    <div className="text-[8px] lg:text-[10px] uppercase tracking-wider text-stone-600 mb-1">Severity</div>
                    <div className={cn("text-xs lg:text-sm font-bold uppercase mt-1", 
                      selectedConflict.severity === 'high' ? 'text-rose-700' : 'text-amber-700'
                    )}>
                      {selectedConflict.severity}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-600 font-semibold mb-2">Affected Entities</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedConflict.affectedFeatureIds.map(id => (
                      <span key={id} className="text-[10px] lg:text-xs font-mono bg-stone-100 text-stone-800 px-2 py-1 rounded border border-stone-300">
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 lg:pt-4 border-t border-stone-200 flex gap-2">
                   <button onClick={() => resolveConflict(selectedConflict.id, 'resolved')} className="flex-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-500/20 py-2 rounded text-[10px] lg:text-xs font-bold transition-colors flex justify-center items-center gap-2">
                     <Check className="w-3 h-3 lg:w-4 lg:h-4"/> ACCEPT
                   </button>
                   <button 
                     onClick={() => {
                       const featureId = selectedConflict.affectedFeatureIds[0];
                       const feature = features.find(f => f.id === featureId);
                       if (feature) {
                         setEditingFeatureId(feature.id);
                         setDrawType(feature.type);
                         if (feature.geometry.type === 'Polygon') {
                           setTracingPoints(feature.geometry.coordinates[0] as [number, number][]);
                         }
                         setIsTracing(true);
                         setSelectedConflict(null);
                       }
                     }}
                     className="flex-1 bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-300 py-2 rounded text-[10px] lg:text-xs font-bold transition-colors flex justify-center items-center gap-2">
                     EDIT
                   </button>
                </div>
             </div>
          </div>
        )}

        {selectedFeature && !selectedConflict && (
          <div className="bg-white/95 backdrop-blur-md border border-stone-300/50 lg:rounded-lg rounded-t-xl shadow-xl pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-8 lg:slide-in-from-right-8 duration-200 max-h-[50vh] lg:max-h-full overflow-y-auto custom-scrollbar flex shrink-0 flex-col">
             <div className="bg-stone-100/50 p-3 lg:p-4 border-b border-stone-300/50 flex justify-between items-start sticky top-0 backdrop-blur-md z-10">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <Maximize className="w-4 h-4 text-emerald-600" />
                   <h3 className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-stone-600">Extracted Feature</h3>
                 </div>
                 <div className="text-stone-900 font-mono text-base lg:text-lg">{selectedFeature.id}</div>
                 <div className="text-[10px] lg:text-xs text-stone-600 capitalize mt-0.5">{selectedFeature.type}</div>
               </div>
               <button onClick={() => setSelectedFeature(null)} className="text-stone-600 hover:text-stone-900"><X className="w-5 h-5"/></button>
             </div>
             <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                
                <div className="flex gap-2 lg:gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex-1 min-w-[30%] bg-stone-100/50 rounded p-2 border border-stone-300/50">
                    <div className="text-[8px] lg:text-[10px] uppercase tracking-wider text-stone-600 mb-1">AI Confidence</div>
                    <div className={cn("text-sm lg:text-lg font-bold", getConfidenceColor(selectedFeature.confidence))}>
                      {selectedFeature.confidence.toFixed(1)}%
                    </div>
                  </div>
                  {selectedFeature.area && (
                    <div className="flex-1 min-w-[30%] bg-stone-100/50 rounded p-2 border border-stone-300/50">
                      <div className="text-[8px] lg:text-[10px] uppercase tracking-wider text-stone-600 mb-1">Est. Area</div>
                      <div className="text-xs lg:text-sm font-bold text-stone-900 mt-1 truncate">
                        {formatArea(selectedFeature.area)}
                      </div>
                    </div>
                  )}
                  {selectedFeature.width && (
                    <div className="flex-1 min-w-[30%] bg-stone-100/50 rounded p-2 border border-stone-300/50">
                      <div className="text-[8px] lg:text-[10px] uppercase tracking-wider text-stone-600 mb-1">Est. Width</div>
                      <div className="text-xs lg:text-sm font-bold text-stone-900 mt-1">
                        {selectedFeature.width.toFixed(1)}m
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-emerald-100 border border-emerald-500/20 rounded p-2 lg:p-3 text-[10px] lg:text-sm text-emerald-700 flex items-start gap-2 lg:gap-3">
                   <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                   <div>
                     <div className="font-bold mb-0.5">Normal Status</div>
                     <div className="text-emerald-700/80 text-[10px] lg:text-xs">No spatial conflicts detected for this feature.</div>
                   </div>
                </div>
                
                <div className="pt-3 lg:pt-4 border-t border-stone-200 flex gap-2">
                   <button 
                     onClick={() => {
                       setEditingFeatureId(selectedFeature.id);
                       setDrawType(selectedFeature.type);
                       if (selectedFeature.geometry.type === 'Polygon') {
                         setTracingPoints(selectedFeature.geometry.coordinates[0] as [number, number][]);
                       }
                       setIsTracing(true);
                       setSelectedFeature(null);
                     }}
                     className="flex-1 bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-300 py-2 rounded text-[10px] lg:text-xs font-bold transition-colors flex justify-center items-center gap-2">
                     EDIT GEOMETRY
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>

    </div>
  );
}

function LayerToggle({ 
  label, color, count, active, onToggle, warning 
}: { 
  label: string, color: string, count?: number, active: boolean, onToggle: () => void, warning?: boolean 
}) {
  return (
    <button 
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between p-2 rounded transition-colors text-sm",
        active ? "bg-stone-100/80 text-stone-900" : "hover:bg-stone-100/40 text-stone-600"
      )}
    >
      <div className="flex items-center gap-3">
        {active ? <Eye className="w-4 h-4 text-stone-600" /> : <EyeOff className="w-4 h-4 opacity-50" />}
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-sm", color, active ? "opacity-100" : "opacity-30")} />
          <span className={cn("font-medium", active ? "text-stone-900" : "text-stone-600")}>{label}</span>
        </div>
      </div>
      <div className={cn(
        "text-xs font-mono px-1.5 py-0.5 rounded",
        warning && active && count && count > 0 ? "bg-rose-200 text-rose-700 font-bold" : "bg-white/50"
      )}>
        {count !== undefined && count}
      </div>
    </button>
  );
}
