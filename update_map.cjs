const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(
  "className={isTracing ? 'tracing-mode' : ''}",
  "" // clean up if exists
);

content = content.replace(
  "<MapContainer \n        center={CENTER} \n        zoom={16} \n        style={{ width: '100%', height: '100%', background: '#0f172a', cursor: isTracing ? 'crosshair' : 'grab' }}\n        zoomControl={false}\n      >",
  "<MapContainer \n        center={CENTER} \n        zoom={16} \n        style={{ width: '100%', height: '100%', background: '#0f172a' }}\n        className={isTracing ? 'tracing-cursor' : ''}\n        zoomControl={false}\n      >"
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
