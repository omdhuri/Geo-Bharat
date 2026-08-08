const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

content = content.replace(
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"',
  'strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
