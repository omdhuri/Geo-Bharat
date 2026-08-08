const fs = require('fs');

function addReactImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes("import React") && !content.includes("import * as React")) {
    if (content.includes("from 'react'")) {
       content = content.replace(/import \{.*?\} from 'react';/, (match) => {
         return "import React, " + match.substring(7);
       });
    } else {
       content = "import React from 'react';\n" + content;
    }
    fs.writeFileSync(filePath, content);
  }
}

addReactImport('src/components/AppShell.tsx');
addReactImport('src/components/ImportModal.tsx');
addReactImport('src/pages/ChangeDetection.tsx');
addReactImport('src/pages/ReviewQueue.tsx');
addReactImport('src/components/map/MapContainer.tsx');

console.log("Done");
