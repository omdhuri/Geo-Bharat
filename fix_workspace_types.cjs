const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

content = content.replace(
  'const handlePointMove = (index, latlng) => {',
  'const handlePointMove = (index: number, latlng: [number, number]) => {'
);
content = content.replace(
  'const handlePointDelete = (index) => {',
  'const handlePointDelete = (index: number) => {'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
