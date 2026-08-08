const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

const propsTarget = `  isLayersTabMobile,
  mapCenter: initialMapCenter,
  searchMarker
}: {`;
const propsReplacement = `  isLayersTabMobile,
  mapCenter: initialMapCenter,
  searchMarker,
  initialConflictId,
  initialAction,
  clearInitialConflict
}: {
  initialConflictId?: string | null;
  initialAction?: 'view' | 'edit' | null;
  clearInitialConflict?: () => void;`;
content = content.replace(propsTarget, propsReplacement);

const effectTarget = `  useEffect(() => {
    if (initialMapCenter) {
      setMapCenter(initialMapCenter);
    }
  }, [initialMapCenter]);`;
const effectReplacement = `  useEffect(() => {
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
  }, [initialConflictId, initialAction, conflicts, features, clearInitialConflict]);`;

content = content.replace(effectTarget, effectReplacement);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
