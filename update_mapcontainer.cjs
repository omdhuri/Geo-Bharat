const fs = require('fs');

let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

// Add useMapEvents
content = content.replace(
  "useMap } from 'react-leaflet';",
  "useMap, useMapEvents } from 'react-leaflet';"
);

// Add MapEvents
const mapEventsCode = `
function MapEvents({ onMapClick }: { onMapClick?: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}
`;

content = content.replace(
  'interface GISMapProps {',
  mapEventsCode + '\ninterface GISMapProps {'
);

// Add props to GISMapProps
content = content.replace(
  'searchMarker?: {lat: number, lon: number, label: string} | null;\n}',
  'searchMarker?: {lat: number, lon: number, label: string} | null;\n  isTracing?: boolean;\n  tracingPoints?: [number, number][];\n  onMapClick?: (latlng: [number, number]) => void;\n}'
);

// Add props to GISMap
content = content.replace(
  'searchMarker\n}: GISMapProps)',
  'searchMarker,\n  isTracing,\n  tracingPoints,\n  onMapClick\n}: GISMapProps)'
);

// Add MapEvents inside MapContainer
content = content.replace(
  '<MapController center={mapCenter || CENTER} zoom={16} />',
  '<MapController center={mapCenter || CENTER} zoom={16} />\n        <MapEvents onMapClick={onMapClick} />'
);

// Add Tracing overlay
const tracingOverlayCode = `
        {/* Tracing Points */}
        {isTracing && tracingPoints && tracingPoints.map((pt, i) => (
          <CircleMarker key={i} center={pt} radius={4} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1 }} />
        ))}
        {isTracing && tracingPoints && tracingPoints.length > 1 && (
          <Polyline positions={tracingPoints} pathOptions={{ color: '#ef4444', weight: 2, dashArray: '5, 5' }} />
        )}
        {isTracing && tracingPoints && tracingPoints.length > 2 && (
          <Polygon positions={tracingPoints} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 2, dashArray: '5, 5' }} />
        )}
`;

content = content.replace(
  '{searchMarker && (',
  tracingOverlayCode + '\n      {searchMarker && ('
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);

console.log("Done");
