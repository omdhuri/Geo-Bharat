const fs = require('fs');
let content = fs.readFileSync('src/pages/ChangeDetection.tsx', 'utf8');

// add imports
content = content.replace(
  "import { Activity, Clock, SlidersHorizontal, Map as MapIcon, ArrowRight, Check } from 'lucide-react';",
  "import { Activity, Clock, SlidersHorizontal, Map as MapIcon, ArrowRight, Check, Layout, Minimize } from 'lucide-react';"
);

// add state
content = content.replace(
  "const [selectedChange, setSelectedChange] = useState<Change | null>(changes[0] || null);",
  "const [selectedChange, setSelectedChange] = useState<Change | null>(changes[0] || null);\n  const [showList, setShowList] = useState(true);"
);

// modify left panel to be hideable
const leftPanelTarget = `<div className="w-full h-1/3 md:w-80 md:h-full border-b md:border-b-0 md:border-r border-stone-200 bg-white flex flex-col z-10 shadow-xl shrink-0">`;
const leftPanelReplacement = `<div className={cn(
        "w-full md:w-80 border-b md:border-b-0 md:border-r border-stone-200 bg-white flex flex-col z-10 shadow-xl shrink-0 transition-all duration-300",
        showList ? "h-1/3 md:h-full opacity-100" : "h-0 md:h-full md:w-0 opacity-0 overflow-hidden border-none md:border-none"
      )}>`;
content = content.replace(leftPanelTarget, leftPanelReplacement);

// modify scrollbar
const scrollbarTarget = `<div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">`;
const scrollbarReplacement = `<div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-2 space-y-2">`;
content = content.replace(scrollbarTarget, scrollbarReplacement);

// Add toggle button to slider area
const sliderAreaTarget = `{/* Main Workspace: Before/After Slider */}
      <div className="flex-1 relative flex flex-col h-2/3 md:h-full">`;
const sliderAreaReplacement = `{/* Main Workspace: Before/After Slider */}
      <div className="flex-1 relative flex flex-col h-2/3 md:h-full">
         <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50 pointer-events-auto">
            <button 
              onClick={() => setShowList(!showList)}
              className={cn(
                "bg-white/80 backdrop-blur-md border border-stone-300/50 w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg text-stone-800 hover:text-stone-900 transition-all flex items-center justify-center shrink-0",
                !showList && "bg-stone-100/90 border-emerald-600/50 text-emerald-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              )}
              title={showList ? "Hide Changes List" : "Show Changes List"}
            >
              {showList ? <Minimize className="w-4 h-4 md:w-5 md:h-5" /> : <Layout className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
         </div>`;
content = content.replace(sliderAreaTarget, sliderAreaReplacement);

fs.writeFileSync('src/pages/ChangeDetection.tsx', content);
console.log("Done");
