const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(
  "import { GeoFeature, Conflict, Change } from '../types';",
  "import { GeoFeature, Conflict, Change } from '../../types';"
);

content = content.replace(
  "import { cn, formatArea, getConfidenceColor } from '../utils';",
  "import { cn, formatArea, getConfidenceColor } from '../../utils';"
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
