const fs = require('fs');
let content = fs.readFileSync('src/pages/ChangeDetection.tsx', 'utf8');

content = content.replace("function MapResizer() {", "function MapResizer({ active }: { active: boolean }) {");
content = content.replace("}, [map]);", "}, [map, active]);");
content = content.replace(/<MapResizer \/>/g, "<MapResizer active={showList} />");

fs.writeFileSync('src/pages/ChangeDetection.tsx', content);
console.log("Done");
