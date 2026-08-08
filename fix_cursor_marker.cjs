const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(
  "className: 'bg-transparent',",
  "className: 'bg-transparent vertex-marker',"
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);

let css = fs.readFileSync('src/index.css', 'utf8');
css += `
.vertex-marker, .vertex-marker * {
  cursor: grab !important;
}
.vertex-marker:active, .vertex-marker:active * {
  cursor: grabbing !important;
}
`;
fs.writeFileSync('src/index.css', css);

console.log("Done");
