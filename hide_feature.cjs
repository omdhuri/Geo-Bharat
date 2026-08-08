const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');
content = content.replace(
  'features={features}',
  'features={features.filter(f => f.id !== editingFeatureId)}'
);
fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
