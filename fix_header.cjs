const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

// Change floating header flex container
content = content.replace(
  '"absolute top-2 md:top-4 left-2 right-2 md:left-4 md:right-4 z-10 flex justify-between items-start pointer-events-none gap-2 transition-all duration-300",',
  '"absolute top-2 md:top-4 left-2 right-2 md:left-4 md:right-4 z-10 flex flex-col lg:flex-row justify-between items-start lg:items-start pointer-events-none gap-2 transition-all duration-300",'
);

// Let's ensure Right side controls stays on the right on mobile
content = content.replace(
  '{/* Right side controls */}\n        <div className="flex items-start gap-1 md:gap-2 shrink-0">',
  '{/* Right side controls */}\n        <div className="flex items-start gap-1 md:gap-2 shrink-0 self-end lg:self-auto mt-2 lg:mt-0">'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
