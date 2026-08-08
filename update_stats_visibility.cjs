const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

content = content.replace(
  '{stats && showOverlays && !isLayersTabMobile && (',
  '{stats && showOverlays && !isLayersTabMobile && !selectedFeature && !selectedConflict && ('
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
