const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(
  "style={{ width: '100%', height: '100%', background: '#0f172a' }}",
  "style={{ width: '100%', height: '100%', background: '#0f172a', cursor: isTracing ? 'crosshair' : 'grab' }}"
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
