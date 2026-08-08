const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

// Change Project context sizing
content = content.replace(
  '"bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg p-2 md:p-3 shadow-lg flex items-start sm:items-center gap-3 md:gap-6 transition-all duration-300",',
  '"bg-white/80 backdrop-blur-md border border-stone-300/50 rounded-lg p-2 md:p-3 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-6 transition-all duration-300 lg:w-auto max-w-[85vw]",'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
