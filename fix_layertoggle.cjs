const fs = require('fs');

let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

content = content.replace(
  'function LayerToggle({ \n  label, color, count, active, onToggle, warning \n}: { \n  label: string, color: string, count: number, active: boolean, onToggle: () => void, warning?: boolean \n}) {',
  'function LayerToggle({ \n  label, color, count, active, onToggle, warning \n}: { \n  label: string, color: string, count?: number, active: boolean, onToggle: () => void, warning?: boolean \n}) {'
);

content = content.replace(
  'warning && active && count > 0 ? "bg-rose-200 text-rose-700 font-bold" : "bg-white/50"\n      )}>\n        {count}\n      </div>',
  'warning && active && count && count > 0 ? "bg-rose-200 text-rose-700 font-bold" : "bg-white/50"\n      )}>\n        {count !== undefined && count}\n      </div>'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);

console.log("Done");
