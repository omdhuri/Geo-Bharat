const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

const handlers = `
  const handlePointMove = (index, latlng) => {
    setTracingPoints(prev => {
      const newPts = [...prev];
      newPts[index] = latlng;
      return newPts;
    });
  };
  
  const handlePointDelete = (index) => {
    setTracingPoints(prev => prev.filter((_, i) => i !== index));
  };
`;

content = content.replace('  const handleMapClick =', handlers + '\n  const handleMapClick =');

const mapTarget = `          onMapClick={handleMapClick}
        />`;

const mapReplacement = `          onMapClick={handleMapClick}
          onPointMove={handlePointMove}
          onPointDelete={handlePointDelete}
        />`;

content = content.replace(mapTarget, mapReplacement);

// Let's add a small tip message
const tipTarget = `<button 
               onClick={undoTracing} `;

const tipReplacement = `<div className="text-[10px] text-stone-500 mr-2 whitespace-nowrap hidden sm:block">
               Drag points to move. Right-click to remove.
             </div>
             <button 
               onClick={undoTracing} `;
               
content = content.replace(tipTarget, tipReplacement);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
