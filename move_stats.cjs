const fs = require('fs');

let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

const statsCodeToMove = `
            {/* Global Stats (if analyzed) */}
            {stats && (
              <>
                <div className="bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg px-2 py-1 md:px-3 md:py-2 shadow-lg flex items-center gap-1.5 md:gap-3 h-10 md:h-12">
                  <div className="flex items-center gap-1.5 md:gap-2">
                     <span className="text-[8px] md:text-[10px] whitespace-nowrap uppercase tracking-wider text-stone-600 font-semibold">Reviews</span>
                     <div className="flex items-center gap-1 text-rose-700">
                       <ShieldAlert className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                       <span className="text-xs md:text-sm font-bold leading-none">{stats.pendingReviews}</span>
                     </div>
                  </div>
                  <button onClick={onOpenReview} className="hidden sm:block text-[9px] md:text-[10px] text-emerald-600 hover:text-emerald-300 font-medium whitespace-nowrap border-l border-stone-300 pl-2 md:pl-3">Open Queue →</button>
                </div>
                
                <div className="bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg px-2 py-1 md:px-3 md:py-2 shadow-lg items-center gap-1.5 md:gap-2 hidden lg:flex h-10 md:h-12">
                   <span className="text-[8px] md:text-[10px] whitespace-nowrap uppercase tracking-wider text-stone-600 font-semibold">Extracted</span>
                   <div className="flex items-center gap-1 text-emerald-700">
                     <Layers className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                     <span className="text-xs md:text-sm font-bold leading-none">{stats.totalFeatures}</span>
                   </div>
                </div>
              </>
            )}
`;

// Remove the stats code from its current position
content = content.replace(statsCodeToMove, '');

// Create the new bottom right container for stats
const newBottomRightStats = `
      {/* Bottom Right Stats */}
      {stats && showOverlays && !isLayersTabMobile && (
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
`;

// Insert it just before Export Modal
content = content.replace('{/* Export Modal */}', newBottomRightStats + '\n\n      {/* Export Modal */}');

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
