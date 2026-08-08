const fs = require('fs');
let content = fs.readFileSync('src/pages/ReviewQueue.tsx', 'utf8');

// 1. Remove scrollbar
content = content.replace(
  'className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-2 space-y-2 md:space-y-1"',
  'className="flex-1 overflow-y-auto p-2 md:p-2 space-y-2 md:space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"'
);

// 2. Make actions visible
content = content.replace(
  'md:border-t-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity"',
  'md:border-t-0 transition-opacity"'
);

fs.writeFileSync('src/pages/ReviewQueue.tsx', content);
console.log("Done");
