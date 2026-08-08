const fs = require('fs');

let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

// Add icons for drawing
content = content.replace(
  "Layout } from 'lucide-react';",
  "Layout, PenTool } from 'lucide-react';"
);

// Add state
const stateCode = `
  const [isTracing, setIsTracing] = useState(false);
  const [tracingPoints, setTracingPoints] = useState<[number, number][]>([]);

  const handleMapClick = (latlng: [number, number]) => {
    if (isTracing) {
      setTracingPoints(prev => [...prev, latlng]);
    }
  };

  const finishTracing = () => {
    if (tracingPoints.length >= 3) {
      const newFeature: GeoFeature = {
        id: \`farm-\${Date.now()}\`,
        type: 'farm',
        geometry: {
          type: 'Polygon',
          coordinates: tracingPoints
        },
        properties: {
          area: 1.5,
          cropType: 'Unknown',
          confidence: 100
        }
      };
      setFeatures([...features, newFeature]);
      setTracingPoints([]);
      setIsTracing(false);
    } else {
      alert('Need at least 3 points to form a polygon');
    }
  };

  const cancelTracing = () => {
    setTracingPoints([]);
    setIsTracing(false);
  };
`;

content = content.replace(
  'const [isAnalyzing, setIsAnalyzing] = useState(false);',
  stateCode + '\n  const [isAnalyzing, setIsAnalyzing] = useState(false);'
);

// Add Trace button to the header (Right side controls)
const traceBtnCode = `
            {/* Trace Toggle */}
            <button
              onClick={() => {
                if (isTracing) {
                  cancelTracing();
                } else {
                  setIsTracing(true);
                  setTracingPoints([]);
                }
              }}
              className={cn(
                "h-10 md:h-12 px-2 md:px-4 rounded-lg shadow-lg text-[10px] md:text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 md:gap-2",
                isTracing 
                  ? "bg-rose-500 hover:bg-rose-600 text-white" 
                  : "bg-white/80 backdrop-blur-md border border-stone-300/50 text-stone-800 hover:text-stone-900"
              )}
            >
              {isTracing ? <X className="w-3 h-3 md:w-4 md:h-4" /> : <PenTool className="w-3 h-3 md:w-4 md:h-4" />}
              <span className="hidden sm:inline">{isTracing ? 'CANCEL TRACING' : 'TRACE FEATURE'}</span>
            </button>
`;

content = content.replace(
  '{/* Global Stats (if analyzed) */}',
  traceBtnCode + '\n            {/* Global Stats (if analyzed) */}'
);

// Add Map container props
content = content.replace(
  'searchMarker={searchMarker}',
  'searchMarker={searchMarker}\n          isTracing={isTracing}\n          tracingPoints={tracingPoints}\n          onMapClick={handleMapClick}'
);

// Add finishing UI for tracing (can be near floating header or bottom center)
const finishUI = `
      {isTracing && tracingPoints.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
           <button onClick={cancelTracing} className="bg-white text-stone-900 px-4 py-2 rounded-full shadow-lg text-sm font-bold border border-stone-200 hover:bg-stone-50">Cancel</button>
           <button onClick={finishTracing} className={cn("px-4 py-2 rounded-full shadow-lg text-sm font-bold text-white", tracingPoints.length >= 3 ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-600/50 cursor-not-allowed")}>Complete Polygon</button>
        </div>
      )}
`;

content = content.replace(
  '{/* Analysis Progress Modal */}',
  finishUI + '\n      {/* Analysis Progress Modal */}'
);


fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
