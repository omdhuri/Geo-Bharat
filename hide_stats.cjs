const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

const target = `{stats && showOverlays && !isLayersTabMobile && !selectedFeature && !selectedConflict && (`;
const replacement = `{stats && showOverlays && !isLayersTabMobile && !selectedFeature && !selectedConflict && !isTracing && (`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
