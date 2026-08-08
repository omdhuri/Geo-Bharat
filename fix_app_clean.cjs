const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/\/\/ REMOVE-START\n/, '');
content = content.replace(/\/\/ REMOVE-END\n/, '');

fs.writeFileSync('src/App.tsx', content);
console.log("Done");
