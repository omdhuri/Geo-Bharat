const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "{['conflicts', 'settings'].includes(activeTab) && (",
  "{['settings'].includes(activeTab) && ("
);

fs.writeFileSync('src/App.tsx', content);
console.log("Done");
