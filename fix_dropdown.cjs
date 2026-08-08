const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

const target = `<select 
               value={drawType} 
               onChange={e => setDrawType(e.target.value as any)}
               className="bg-transparent text-sm font-bold text-stone-700 outline-none px-3 py-1 cursor-pointer border-r border-stone-200 appearance-none"
             >
               <option value="farm">Farm</option>
               <option value="building">Building</option>
               <option value="road">Road</option>
               <option value="water">Water</option>
               <option value="tree">Tree</option>
               <option value="lulc">LULC</option>
             </select>`;

const replacement = `<div className="relative flex items-center border-r border-stone-200">
               <select 
                 value={drawType} 
                 onChange={e => setDrawType(e.target.value as any)}
                 className="bg-transparent text-sm font-bold text-stone-700 outline-none pl-3 pr-7 py-1 cursor-pointer appearance-none relative z-10 w-full"
               >
                 <option value="farm">Farm</option>
                 <option value="building">Building</option>
                 <option value="road">Road</option>
                 <option value="water">Water</option>
                 <option value="tree">Tree</option>
                 <option value="lulc">LULC</option>
               </select>
               <div className="absolute right-2 text-stone-500 pointer-events-none z-0">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
               </div>
             </div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
