const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

content = content.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useRef, useEffect } from 'react';"
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
