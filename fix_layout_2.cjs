const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

content = content.replace(
  'max-w-[calc(100vw-80px)] md:max-w-[85vw]',
  'max-w-[calc(100vw-110px)] md:max-w-[75vw]'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
