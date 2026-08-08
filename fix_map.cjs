const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

const vertexIcon = `
const vertexIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: '<div style="width: 12px; height: 12px; background: white; border: 2px solid #ef4444; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.3); transform: translate(-6px, -6px);"></div>',
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});
`;

content = content.replace('const CENTER =', vertexIcon + '\nconst CENTER =');

const propsTarget = `  tracingPoints?: [number, number][];
  onMapClick?: (latlng: [number, number]) => void;`;

const propsReplacement = `  tracingPoints?: [number, number][];
  onMapClick?: (latlng: [number, number]) => void;
  onPointMove?: (index: number, latlng: [number, number]) => void;
  onPointDelete?: (index: number) => void;`;

content = content.replace(propsTarget, propsReplacement);

const paramsTarget = `  isTracing,
  tracingPoints,
  onMapClick
}: GISMapProps) {`;

const paramsReplacement = `  isTracing,
  tracingPoints,
  onMapClick,
  onPointMove,
  onPointDelete
}: GISMapProps) {`;

content = content.replace(paramsTarget, paramsReplacement);

const renderTarget = `{isTracing && tracingPoints && tracingPoints.map((pt, i) => (
          <CircleMarker key={i} center={pt} radius={4} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1 }} />
        ))}`;

const renderReplacement = `{isTracing && tracingPoints && tracingPoints.map((pt, i) => (
          <Marker 
            key={i} 
            position={pt} 
            icon={vertexIcon}
            draggable={true}
            eventHandlers={{
              drag: (e) => {
                if (onPointMove) {
                  const latLng = e.target.getLatLng();
                  onPointMove(i, [latLng.lat, latLng.lng]);
                }
              },
              contextmenu: (e) => {
                L.DomEvent.stopPropagation(e.originalEvent);
                if (onPointDelete) onPointDelete(i);
              },
              click: (e) => {
                L.DomEvent.stopPropagation(e.originalEvent);
              }
            }} 
          />
        ))}`;

content = content.replace(renderTarget, renderReplacement);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
