const fs = require('fs');
let content = fs.readFileSync('src/components/AppShell.tsx', 'utf8');

const target = `<div className="w-full px-2 mb-4">
          <button 
            onClick={onImportClick}
            className="w-full aspect-square bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all active:scale-95 group"
            title="Import Data / New Project"
          >
            <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>`;

const replacement = `<div className="w-full flex justify-center mb-4">
          <button 
            onClick={onImportClick}
            className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow shadow-emerald-600/20 transition-all active:scale-95 group"
            title="Import Data / New Project"
          >
            <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/AppShell.tsx', content);
console.log("Done");
