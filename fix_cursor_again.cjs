const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

content = content.replace(
  /cursor:\s*url\(.*?\).*?;/g,
  "cursor: url('/pen.svg') 0 24, crosshair !important;"
);

fs.writeFileSync('src/index.css', content);
console.log("Done");
