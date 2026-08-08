const fs = require('fs');
const path = require('path');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

// We only want to replace lg: with md: in the Right Inspector Panel section
const startStr = "{/* Right Inspector Panel */}";
const endStr = "{/* Export Modal */}";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);
  let middle = content.substring(startIndex, endIndex);
  
  // Replace lg: with md:
  middle = middle.replace(/lg:/g, 'md:');
  
  content = before + middle + after;
  fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
  console.log('Replaced lg: with md: in Right Inspector Panel');
} else {
  console.log('Could not find start or end strings');
}
