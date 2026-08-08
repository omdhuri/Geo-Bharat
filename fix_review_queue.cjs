const fs = require('fs');
let content = fs.readFileSync('src/pages/ReviewQueue.tsx', 'utf8');

const targetProps = `  onNavigateToConflict: (c: Conflict) => void,`;
const replacementProps = `  onNavigateToConflict: (c: Conflict, action?: 'view' | 'edit') => void,`;
content = content.replace(targetProps, replacementProps);

const targetBtn = `<button className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors flex items-center gap-1.5">
                      EDIT <ArrowRight className="w-3 h-3 hidden sm:block" />
                    </button>`;
const replacementBtn = `<button 
                      onClick={() => onNavigateToConflict(conflict, 'edit')}
                      className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors flex items-center gap-1.5">
                      EDIT <ArrowRight className="w-3 h-3 hidden sm:block" />
                    </button>`;
content = content.replace(targetBtn, replacementBtn);

fs.writeFileSync('src/pages/ReviewQueue.tsx', content);
console.log("Done");
