const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

// Replace left panel classes
content = content.replace(
  'isLayersTabMobile \n          ? "inset-0 p-4 pb-20 pointer-events-auto bg-stone-50/90 backdrop-blur md:bg-transparent md:backdrop-blur-none md:p-0 md:inset-auto md:top-28 md:left-4 md:max-h-[calc(100vh-9rem)] md:w-64" \n          : "hidden md:flex top-28 left-4 max-h-[calc(100vh-9rem)] w-64 pointer-events-none",',
  'isLayersTabMobile \n          ? "inset-0 p-4 pb-20 pointer-events-auto bg-stone-50/90 backdrop-blur md:bg-transparent md:backdrop-blur-none md:p-0 md:inset-auto md:top-28 md:left-4 md:max-h-[calc(100vh-9rem)] md:w-64" \n          : "hidden", // Hidden on both desktop and mobile when not active'
);

// We need to find the exact string, let's just do a string replace for the Right Inspector Panel.
content = content.replace(
  'isLayersTabMobile ? "opacity-0 md:opacity-100 translate-y-10 md:translate-y-0 pointer-events-none" : "opacity-100 translate-y-0",',
  'isLayersTabMobile ? "opacity-0 md:opacity-100 translate-y-10 md:translate-y-0 md:pointer-events-auto pointer-events-none" : "opacity-100 translate-y-0",'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
