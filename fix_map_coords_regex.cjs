const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(/conflict\.geometry\.coordinates\[0\]/g, '(conflict.geometry.coordinates as [number, number])[0]');
content = content.replace(/conflict\.geometry\.coordinates\[1\]/g, '(conflict.geometry.coordinates as [number, number])[1]');

fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
