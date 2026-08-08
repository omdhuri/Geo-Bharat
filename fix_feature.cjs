const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

const target = `      const newFeature: GeoFeature = {
        id: \`farm-\${Date.now()}\`,
        type: 'farm',
        geometry: {
          type: 'Polygon',
          coordinates: [tracingPoints]
        },
        properties: {
          area: 0.5,
          crop: 'Unknown',
          health: 0.8
        }
      };`;

const replacement = `      const newFeature: GeoFeature = {
        id: \`farm-\${Date.now()}\`,
        type: 'farm',
        geometry: {
          type: 'Polygon',
          coordinates: [tracingPoints]
        },
        confidence: 1,
        status: 'accepted',
        source: 'manual',
        createdAt: new Date().toISOString()
      };`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);
console.log("Done");
