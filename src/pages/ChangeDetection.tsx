import { useState } from 'react';
import { Change, Position } from '../types';
import { Activity, Clock, SlidersHorizontal, Map as MapIcon, ArrowRight, Check } from 'lucide-react';
import { cn, getConfidenceColor } from '../utils';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function ChangeDetection({
  changes
}: {
  changes: Change[]
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedChange, setSelectedChange] = useState<Change | null>(changes[0] || null);

  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const getCenter = (change: Change | null): [number, number] => {
    if (!change) return [17.6805, 74.0183];
    
    if (change.geometry.type === 'Point') {
      return change.geometry.coordinates as [number, number];
    } else {
      try {
        const coords = change.geometry.coordinates as Position[][];
        if (coords && coords.length > 0 && coords[0].length > 0) {
          const ring = coords[0];
          const latSum = ring.reduce((sum, p) => sum + p[0], 0);
          const lngSum = ring.reduce((sum, p) => sum + p[1], 0);
          return [latSum / ring.length, lngSum / ring.length];
        }
      } catch (e) {
        // Fallback on error
      }
    }
    return [17.6805, 74.0183];
  };

  const centerPoint = getCenter(selectedChange);

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-stone-50 animate-in fade-in duration-200">
      
      {/* Left Sidebar: Change List */}
      <div className="w-full h-1/3 md:w-80 md:h-full border-b md:border-b-0 md:border-r border-stone-200 bg-white flex flex-col z-10 shadow-xl shrink-0">
        <div className="p-3 md:p-4 border-b border-stone-200 shrink-0 bg-white/90 backdrop-blur z-20">
           <h2 className="text-base md:text-lg font-bold text-stone-900 flex items-center gap-2 mb-0.5 md:mb-1">
             <Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
             Change Detection
           </h2>
           <p className="text-[10px] md:text-xs text-stone-600">Compare March 2024 vs March 2026</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
           {changes.map(change => (
             <button
               key={change.id}
               onClick={() => setSelectedChange(change)}
               className={cn(
                 "w-full text-left p-2 md:p-3 rounded-lg border transition-all duration-200",
                 selectedChange?.id === change.id 
                   ? "bg-stone-100/80 border-emerald-600/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                   : "bg-white border-stone-200 hover:bg-stone-100 hover:border-stone-300"
               )}
             >
               <div className="flex justify-between items-start mb-1">
                 <span className="font-mono text-[10px] md:text-xs text-stone-800">{change.id}</span>
                 <span className={cn(
                   "text-[8px] md:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                   change.changeType === 'new' ? "bg-emerald-100 text-emerald-700" :
                   change.changeType === 'removed' ? "bg-rose-100 text-rose-700" :
                   "bg-amber-100 text-amber-700"
                 )}>
                   {change.changeType}
                 </span>
               </div>
               <div className="text-xs md:text-sm font-medium text-stone-900 mb-1">{change.description}</div>
               <div className="flex items-center gap-2 text-[10px] md:text-xs text-stone-600">
                 <span className="capitalize">{change.featureType}</span>
                 <span className="w-1 h-1 bg-stone-200 rounded-full" />
                 <span className={getConfidenceColor(change.confidence)}>{change.confidence.toFixed(1)}% conf</span>
               </div>
             </button>
           ))}
        </div>
      </div>

      {/* Main Workspace: Before/After Slider */}
      <div className="flex-1 relative flex flex-col h-2/3 md:h-full">
         {/* Top Controls */}
         <div className="absolute top-2 md:top-4 left-2 right-2 md:left-4 md:right-4 z-50 flex justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md border border-stone-300/50 rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-xl pointer-events-auto flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium">
               <span className="text-stone-600">Mar 2024</span>
               <div className="w-8 md:w-12 h-1 bg-gradient-to-r from-stone-300 to-emerald-600 rounded-full" />
               <span className="text-emerald-600">Mar 2026</span>
            </div>
         </div>

         {/* Interactive Slider Area */}
         <div 
           className="flex-1 relative cursor-ew-resize select-none overflow-hidden touch-none" 
           onMouseMove={handleDrag}
           onMouseDown={handleDrag}
           onTouchMove={(e) => {
             const touch = e.touches[0];
             const rect = e.currentTarget.getBoundingClientRect();
             const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
             setSliderPosition((x / rect.width) * 100);
           }}
         >
            {/* The "Map" Backgrounds - simulated with styled divs for prototype */}
            {/* 2024 Map (Left) */}
            <div className="absolute inset-0 bg-[#0f172a]">
               <MapContainer 
                  center={centerPoint} 
                  zoom={18} 
                  style={{ width: '100%', height: '100%', background: '#0f172a', filter: 'grayscale(30%) sepia(20%) contrast(1.2)' }}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  touchZoom={false}
                  key={`map-old-${selectedChange?.id}`}
               >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri"
                  />
               </MapContainer>
            </div>

            {/* 2026 Map (Right - Clipped) */}
            <div 
              className="absolute inset-0 bg-[#0f172a]" 
              style={{ 
                clipPath: `inset(0 0 0 ${sliderPosition}%)`
              }}
            >
               <MapContainer 
                  center={centerPoint} 
                  zoom={18} 
                  style={{ width: '100%', height: '100%', background: '#0f172a' }}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  touchZoom={false}
                  key={`map-new-${selectedChange?.id}`}
               >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri"
                  />
               </MapContainer>
               
               {/* Highlight the change on the new map side */}
               {selectedChange && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                     <div className={cn(
                       "w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 flex items-center justify-center animate-pulse",
                       selectedChange.changeType === 'new' ? 'bg-emerald-200 border-emerald-600' :
                       selectedChange.changeType === 'removed' ? 'bg-rose-200 border-rose-600' :
                       'bg-amber-200 border-amber-600'
                     )}>
                        <span className="bg-white/80 px-2 py-1 rounded text-[10px] md:text-xs font-bold text-stone-900 shadow">
                          {selectedChange.changeType.toUpperCase()}
                        </span>
                     </div>
                  </div>
               )}
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] z-40 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-10 md:w-8 md:h-12 bg-white rounded flex items-center justify-center shadow-lg">
                 <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5 text-stone-900 rotate-90" />
               </div>
            </div>
         </div>

         {/* Bottom Context Panel for Selected Change */}
         {selectedChange && (
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-50">
               <div className="bg-white/95 backdrop-blur-md border border-stone-300 shadow-2xl rounded-xl p-3 md:p-4 w-full md:w-[500px] flex gap-4">
                  <div className="flex-1">
                     <h3 className="text-xs md:text-sm font-bold text-stone-900 mb-1">{selectedChange.description}</h3>
                     <p className="text-[10px] md:text-xs text-stone-600 mb-2 md:mb-3 hidden sm:block">Confidence score indicates high likelihood of structural change.</p>
                     
                     <div className="flex gap-2">
                        <button className="flex-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 py-1.5 rounded text-[10px] md:text-xs font-bold transition-colors flex justify-center items-center gap-1.5">
                           <Check className="w-3 h-3"/> VERIFY
                        </button>
                        <button className="flex-1 bg-stone-100 text-stone-800 hover:bg-stone-200 py-1.5 rounded text-[10px] md:text-xs font-bold transition-colors flex justify-center items-center gap-1.5">
                           FLAG
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
}
