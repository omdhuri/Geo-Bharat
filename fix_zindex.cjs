const fs = require('fs');
let content = fs.readFileSync('src/pages/ChangeDetection.tsx', 'utf8');

// Top Controls z-index fix
content = content.replace(
  'absolute top-2 md:top-4 left-2 right-2 md:left-4 md:right-4 z-20 flex justify-center pointer-events-none',
  'absolute top-2 md:top-4 left-2 right-2 md:left-4 md:right-4 z-50 flex justify-center pointer-events-none'
);

// Bottom panel just in case
content = content.replace(
  'absolute bottom-4 left-4 right-4 md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-20',
  'absolute bottom-4 left-4 right-4 md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-50'
);

fs.writeFileSync('src/pages/ChangeDetection.tsx', content);
console.log("Done");
