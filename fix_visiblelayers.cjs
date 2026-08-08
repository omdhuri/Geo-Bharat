const fs = require('fs');
let content = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

content = content.replace(
  '  const [visibleLayers, setVisibleLayers] = useState({\n    farms: true,\n    buildings: true,\n    roads: true,\n    trees: true,\n    water: true,\n    conflicts: true\n  });',
  '  const [visibleLayers, setVisibleLayers] = useState({\n    farms: true,\n    buildings: true,\n    roads: true,\n    trees: true,\n    water: true,\n    conflicts: true,\n    labels: true\n  });'
);

content = content.replace(
  '<LayerToggle label="Farm Boundaries" color="bg-green-500"',
  '<LayerToggle label="Map Labels" color="bg-stone-500" active={visibleLayers.labels} onToggle={() => toggleLayer(\'labels\')} />\n            <LayerToggle label="Farm Boundaries" color="bg-green-500"'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', content);

console.log("Done");
