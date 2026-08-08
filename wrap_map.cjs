const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(
  '<div className="w-full h-full relative bg-white">',
  '<div className={`w-full h-full relative bg-white ${isTracing ? "tracing-cursor" : ""}`}>'
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
