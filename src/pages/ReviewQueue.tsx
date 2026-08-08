import { useState } from 'react';
import { GeoFeature, Conflict, Change, ProjectStats } from '../types';
import { ShieldAlert, Check, X, Search, ChevronRight, Activity, Map as MapIcon, ArrowRight } from 'lucide-react';
import { cn, getConfidenceColor } from '../utils';

export default function ReviewQueue({
  conflicts,
  changes,
  onNavigateToConflict,
  onResolveConflict
}: {
  conflicts: Conflict[],
  changes: Change[],
  onNavigateToConflict: (c: Conflict) => void,
  onResolveConflict: (id: string, status: 'resolved') => void
}) {
  const [filter, setFilter] = useState<'all' | 'high' | 'boundary' | 'buffer'>('all');

  const filteredConflicts = conflicts.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'high') return c.severity === 'high';
    if (filter === 'boundary') return c.type === 'boundary_cross' || c.type === 'overlap';
    if (filter === 'buffer') return c.type === 'road_buffer' || c.type === 'water_buffer' || c.type === 'setback';
    return true;
  });

  return (
    <div className="w-full h-full bg-stone-50 flex flex-col overflow-hidden animate-in fade-in duration-200 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-stone-900 mb-1 md:mb-2 flex items-center gap-2 md:gap-3">
            <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-rose-700" />
            Review Queue
          </h1>
          <p className="text-stone-600 text-xs md:text-sm">
            {conflicts.length} items require human verification.
          </p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar snap-x">
           <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
           <FilterButton active={filter === 'high'} onClick={() => setFilter('high')}>High Priority</FilterButton>
           <FilterButton active={filter === 'boundary'} onClick={() => setFilter('boundary')}>Boundary Issues</FilterButton>
           <FilterButton active={filter === 'buffer'} onClick={() => setFilter('buffer')}>Buffer Conflicts</FilterButton>
        </div>
      </div>

      <div className="flex-1 bg-white border border-stone-200 md:rounded-xl overflow-hidden flex flex-col shadow-xl -mx-4 md:mx-0">
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-stone-200 bg-stone-100/30 text-xs font-bold uppercase tracking-wider text-stone-600">
          <div className="col-span-2">Conflict ID</div>
          <div className="col-span-3">Issue Description</div>
          <div className="col-span-2">Affected Features</div>
          <div className="col-span-1 text-center">Confidence</div>
          <div className="col-span-1 text-center">Severity</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        
        {/* Table Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-2 space-y-2 md:space-y-1">
          {filteredConflicts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-600 py-12">
              <ShieldAlert className="w-10 h-10 md:w-12 md:h-12 mb-4 opacity-20" />
              <p className="text-sm md:text-base">No pending items in this category.</p>
            </div>
          ) : (
            filteredConflicts.map(conflict => (
              <div key={conflict.id} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 p-3 md:p-3 items-start md:items-center bg-white hover:bg-stone-100/80 rounded-lg border border-stone-200 transition-colors group">
                
                {/* Mobile Header: ID & Severity */}
                <div className="flex justify-between items-center w-full md:hidden mb-1">
                  <div className="font-mono text-sm text-stone-900">{conflict.id}</div>
                  <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                    conflict.severity === 'high' ? 'bg-rose-100 text-rose-700 border border-rose-500/20' : 
                    'bg-amber-100 text-amber-700 border border-amber-500/20'
                  )}>
                    {conflict.severity}
                  </span>
                </div>

                <div className="hidden md:block col-span-2 font-mono text-sm text-stone-900">{conflict.id}</div>
                <div className="md:col-span-3">
                  <div className="text-sm font-medium text-stone-800">{conflict.description}</div>
                  <div className="text-xs text-stone-600 capitalize mt-0.5">{conflict.type.replace('_', ' ')}</div>
                </div>
                
                <div className="md:col-span-2 flex flex-wrap gap-1">
                  <span className="md:hidden text-[10px] text-stone-600 uppercase font-semibold mr-1 self-center">Entities:</span>
                  {conflict.affectedFeatureIds.map(id => (
                    <span key={id} className="text-[10px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-300">
                      {id}
                    </span>
                  ))}
                </div>
                
                <div className="md:col-span-1 md:text-center flex items-center gap-2 md:block">
                  <span className="md:hidden text-[10px] text-stone-600 uppercase font-semibold">AI Confidence:</span>
                  <span className={cn("text-sm font-bold", getConfidenceColor(conflict.confidence))}>
                    {conflict.confidence.toFixed(1)}%
                  </span>
                </div>
                
                <div className="hidden md:block col-span-1 text-center">
                  <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full",
                    conflict.severity === 'high' ? 'bg-rose-100 text-rose-700 border border-rose-500/20' : 
                    'bg-amber-100 text-amber-700 border border-amber-500/20'
                  )}>
                    {conflict.severity}
                  </span>
                </div>
                
                <div className="md:col-span-3 flex justify-between md:justify-end gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-stone-200 md:border-t-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onNavigateToConflict(conflict)}
                    className="p-2 md:p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition-colors flex items-center gap-2"
                    title="View on Map"
                  >
                    <MapIcon className="w-4 h-4" /> <span className="md:hidden text-xs font-bold">VIEW</span>
                  </button>
                  <div className="hidden md:block w-px h-6 bg-stone-200 mx-1 self-center" />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onResolveConflict(conflict.id, 'resolved')}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-600/20 rounded transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3" /> ACCEPT
                    </button>
                    <button className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors flex items-center gap-1.5">
                      EDIT <ArrowRight className="w-3 h-3 hidden sm:block" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        active ? "bg-emerald-600/10 text-emerald-600 border border-emerald-600/30" : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 hover:text-stone-900"
      )}
    >
      {children}
    </button>
  );
}
