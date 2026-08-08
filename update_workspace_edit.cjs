const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

// Add editingFeatureId state
content = content.replace(
  "const [tracingPoints, setTracingPoints] = useState<[number, number][]>([]);\n  const [drawType, setDrawType] = useState<GeoFeature['type']>('farm');",
  "const [tracingPoints, setTracingPoints] = useState<[number, number][]>([]);\n  const [drawType, setDrawType] = useState<GeoFeature['type']>('farm');\n  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);"
);

// update cancelTracing
content = content.replace(
  "const cancelTracing = () => {\n    setTracingPoints([]);\n    setIsTracing(false);\n  };",
  "const cancelTracing = () => {\n    setTracingPoints([]);\n    setIsTracing(false);\n    setEditingFeatureId(null);\n  };"
);

// update finishTracing
const oldFinishTracing = `const finishTracing = () => {
    if (tracingPoints.length >= 3) {
      const newFeature: GeoFeature = {
        id: \`farm-\${Date.now()}\`,
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
      setTracingPoints([]);
      setIsTracing(false);
    } else {
      alert('Need at least 3 points to form a polygon');
    }
  };`;

const newFinishTracing = `const finishTracing = () => {
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
          id: \`feature-\${Date.now()}\`,
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
  };`;

content = content.replace(oldFinishTracing, newFinishTracing);

// replace EDIT GEOMETRY button
const oldButton = `<button className="flex-1 bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-300 py-2 rounded text-[10px] lg:text-xs font-bold transition-colors flex justify-center items-center gap-2">
                     EDIT GEOMETRY
                   </button>`;
const newButton = `<button 
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
                   </button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
