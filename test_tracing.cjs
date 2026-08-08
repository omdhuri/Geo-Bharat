const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

content = content.replace(
  'const handleMapClick = (latlng: [number, number]) => {',
  'const handleMapClick = (latlng: [number, number]) => {\n    console.log("handleMapClick", isTracing, latlng);'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
