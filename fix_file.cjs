const fs = require('fs');
let lines = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8').split('\n');
// We keep lines 0 to 235 (which corresponds to 1 to 236), and lines 508 to end
let newLines = lines.slice(0, 236).concat(lines.slice(508));
fs.writeFileSync('src/pages/MapWorkspace.tsx', newLines.join('\n'));
