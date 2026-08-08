const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

// Hide Project Context when tracing
content = content.replace(
  `!showOverlays && "opacity-0 -translate-y-4"`,
  `(!showOverlays || isTracing) && "opacity-0 -translate-y-4 pointer-events-none"`
);

// Hide Left Panel when tracing
content = content.replace(
  `!showOverlays && "opacity-0 -translate-x-8 pointer-events-none"`,
  `(!showOverlays || isTracing) && "opacity-0 -translate-x-8 pointer-events-none"`
);

// Hide Right Panel when tracing
content = content.replace(
  `!showOverlays && "opacity-0 translate-x-8 pointer-events-none"`,
  `(!showOverlays || isTracing) && "opacity-0 translate-x-8 pointer-events-none"`
);

// Ensure the "Trace Feature" button clears selectedFeature/Conflict
const oldTraceToggle = `setIsTracing(true);
                  setTracingPoints([]);`;
const newTraceToggle = `setIsTracing(true);
                  setTracingPoints([]);
                  setSelectedFeature(null);
                  setSelectedConflict(null);`;

content = content.replace(oldTraceToggle, newTraceToggle);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
