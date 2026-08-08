const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(
  "function MapEvents({ onMapClick }: { onMapClick?: (latlng: [number, number]) => void }) {",
  "import { useRef } from 'react';\nfunction MapEvents({ onMapClick }: { onMapClick?: (latlng: [number, number]) => void }) {\n  const onMapClickRef = useRef(onMapClick);\n  useEffect(() => { onMapClickRef.current = onMapClick; }, [onMapClick]);"
);

content = content.replace(
  "    click(e) {\n      if (onMapClick) {\n        onMapClick([e.latlng.lat, e.latlng.lng]);\n      }\n    },",
  "    click(e) {\n      if (onMapClickRef.current) {\n        onMapClickRef.current([e.latlng.lat, e.latlng.lng]);\n      }\n    },"
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
