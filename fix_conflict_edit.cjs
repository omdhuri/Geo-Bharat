const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

const target = `<button className="flex-1 bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-300 py-2 rounded text-[10px] lg:text-xs font-bold transition-colors flex justify-center items-center gap-2">
                     EDIT
                   </button>`;

const replacement = `<button 
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
                   </button>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
