const fs = require('fs');
let content = fs.readFileSync('src/pages/ChangeDetection.tsx', 'utf8');

const mapControllerCode = `
function MapResizer() {
  const map = useMap();
  React.useEffect(() => {
    // Small delay to allow CSS transitions to complete
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 350);
    
    // Also attach to window resize
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);
  return null;
}
`;

content = content.replace("export default function ChangeDetection({", mapControllerCode + "\nexport default function ChangeDetection({");

content = content.replace("import { MapContainer, TileLayer } from 'react-leaflet';", "import { MapContainer, TileLayer, useMap } from 'react-leaflet';");

content = content.replace(
  /<TileLayer\s+url="https:\/\/server\.arcgisonline\.com\/ArcGIS\/rest\/services\/World_Imagery\/MapServer\/tile\/\{z\}\/\{y\}\/\{x\}"\s+attribution="Esri"\s+\/>/g,
  `<TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri"
                  />
                  <MapResizer />`
);

fs.writeFileSync('src/pages/ChangeDetection.tsx', content);
console.log("Done");
