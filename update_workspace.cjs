const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

// Update lucide-react imports
content = content.replace(
  "import { Layers, Play, CheckCircle2, AlertTriangle, Eye, EyeOff, Loader2, Maximize, Minimize, Check, X, ShieldAlert, ChevronRight, Activity, Download, Layout, PenTool } from 'lucide-react';",
  "import { Layers, Play, CheckCircle2, AlertTriangle, Eye, EyeOff, Loader2, Maximize, Minimize, Check, X, ShieldAlert, ChevronRight, Activity, Download, Layout, PenTool, Undo } from 'lucide-react';"
);

// Add drawType state
content = content.replace(
  "const [tracingPoints, setTracingPoints] = useState<[number, number][]>([]);",
  "const [tracingPoints, setTracingPoints] = useState<[number, number][]>([]);\n  const [drawType, setDrawType] = useState<GeoFeature['type']>('farm');"
);

// Add undo tracing function
content = content.replace(
  "const finishTracing = () => {",
  "const undoTracing = () => {\n    setTracingPoints(prev => prev.slice(0, -1));\n  };\n\n  const finishTracing = () => {"
);

// Use drawType when creating new feature
content = content.replace(
  "        type: 'farm',",
  "        type: drawType,"
);

// Add drawing toolbar when tracing
const toolbarTarget = `{isTracing && tracingPoints.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
           <button onClick={cancelTracing} className="bg-white text-stone-900 px-4 py-2 rounded-full shadow-lg text-sm font-bold border border-stone-200 hover:bg-stone-50">Cancel</button>
           <button onClick={finishTracing} className={cn("px-4 py-2 rounded-full shadow-lg text-sm font-bold text-white", tracingPoints.length >= 3 ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-600/50 cursor-not-allowed")}>Complete Polygon</button>
        </div>
      )}`;

const toolbarReplacement = `{isTracing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-stone-200 p-1.5 flex gap-1 items-center">
             <select 
               value={drawType} 
               onChange={e => setDrawType(e.target.value as any)}
               className="bg-transparent text-sm font-bold text-stone-700 outline-none px-3 py-1 cursor-pointer border-r border-stone-200 appearance-none"
             >
               <option value="farm">Farm</option>
               <option value="building">Building</option>
               <option value="road">Road</option>
               <option value="water">Water</option>
               <option value="tree">Tree</option>
               <option value="lulc">LULC</option>
             </select>
             
             <div className="px-3 py-1 text-xs font-medium text-stone-500 border-r border-stone-200">
               {tracingPoints.length} points
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
      )}`;

content = content.replace(toolbarTarget, toolbarReplacement);
fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
