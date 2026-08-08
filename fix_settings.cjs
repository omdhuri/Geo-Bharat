const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import ChangeDetection from './pages/ChangeDetection';",
  "import ChangeDetection from './pages/ChangeDetection';\nimport Settings from './pages/Settings';"
);

content = content.replace(
  "{['settings'].includes(activeTab) && (",
  "// REMOVE-START\n      {['settings'].includes(activeTab) && ("
);

content = content.replace(
  "        </div>\n      )}",
  "        </div>\n      )}\n      // REMOVE-END"
);

// We need to completely remove the old settings placeholder block and replace it with the new component.
// I will just use regex to match that block.

content = content.replace(
  /\{\['settings'\]\.includes\(activeTab\) && \([\s\S]*?<\/div>\s*\)\}/,
  `{activeTab === 'settings' && <Settings />}`
);


// wait, if I used REMOVE-START and REMOVE-END, maybe I should just use regex on the original file
fs.writeFileSync('src/App.tsx', content);
console.log("Done");
