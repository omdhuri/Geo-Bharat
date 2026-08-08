const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

if (!content.includes('const [cursorPos, setCursorPos] = React.useState')) {
  content = content.replace(
    'export default function GISMap({',
    'export default function GISMap({\n'
  );
  
  const target1 = `  onMapClick
}: GISMapProps) {`;
  const replacement1 = `  onMapClick
}: GISMapProps) {
  const [cursorPos, setCursorPos] = React.useState<[number, number] | null>(null);`;
  content = content.replace(target1, replacement1);
  
  const target2 = `<MapEvents onMapClick={onMapClick} />`;
  const replacement2 = `<MapEvents 
          onMapClick={onMapClick} 
          onMouseMove={(latlng) => {
            if (isTracing) setCursorPos(latlng);
          }} 
        />`;
  content = content.replace(target2, replacement2);
  
  // Add polyline for cursor
  const target3 = `{isTracing && tracingPoints && tracingPoints.map((pt, i) => (`;
  const replacement3 = `{isTracing && cursorPos && tracingPoints && tracingPoints.length > 0 && (
          <Polyline positions={[tracingPoints[tracingPoints.length - 1], cursorPos]} pathOptions={{ color: '#ef4444', weight: 2, dashArray: '5, 5', opacity: 0.5 }} />
        )}
        {isTracing && tracingPoints && tracingPoints.map((pt, i) => (`;
  content = content.replace(target3, replacement3);
  
  fs.writeFileSync('src/components/map/MapContainer.tsx', content);
}
console.log("Done");
