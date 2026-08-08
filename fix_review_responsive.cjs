const fs = require('fs');
let content = fs.readFileSync('src/pages/ReviewQueue.tsx', 'utf8');

// Ensure the container looks like a continuous list on mobile, but cards on desktop
const targetContainer = `className="flex-1 bg-white border border-stone-200 md:rounded-xl overflow-hidden flex flex-col shadow-xl -mx-4 md:mx-0"`;
const replacementContainer = `className="flex-1 bg-white border-y md:border border-stone-200 md:rounded-xl overflow-hidden flex flex-col md:shadow-xl -mx-4 md:mx-0"`;
content = content.replace(targetContainer, replacementContainer);

// Make the list wrapper scroll properly and have correct padding
const targetList = `className="flex-1 overflow-y-auto p-2 md:p-2 space-y-2 md:space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"`;
const replacementList = `className="flex-1 overflow-y-auto p-0 md:p-2 space-y-0 md:space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"`;
content = content.replace(targetList, replacementList);

// Change mobile cards to look like list items rather than separate cards to save space
const targetCard = `className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 p-3 md:p-3 items-start md:items-center bg-white hover:bg-stone-100/80 rounded-lg border border-stone-200 transition-colors group"`;
const replacementCard = `className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 p-4 md:p-3 items-start md:items-center bg-white hover:bg-stone-50 md:rounded-lg border-b md:border border-stone-200 last:border-b-0 transition-colors group"`;
content = content.replace(targetCard, replacementCard);

// Remove the Entities and Confidence labels from wrapping weirdly on mobile
const targetEntities = `<span className="md:hidden text-[10px] text-stone-600 uppercase font-semibold mr-1 self-center">Entities:</span>`;
const replacementEntities = `<span className="md:hidden text-[10px] text-stone-500 uppercase font-bold mr-1 self-center tracking-wider">Features:</span>`;
content = content.replace(targetEntities, replacementEntities);

fs.writeFileSync('src/pages/ReviewQueue.tsx', content);
console.log("Done");
