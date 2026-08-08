const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

const target = `function MapEvents({ onMapClick }: { onMapClick?: (latlng: [number, number]) => void }) {
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => { onMapClickRef.current = onMapClick; }, [onMapClick]);
  useMapEvents({
    click(e) {
      if (onMapClickRef.current) {
        onMapClickRef.current([e.latlng.lat, e.latlng.lng]);
      }
    },
  });`;

const replacement = `function MapEvents({ onMapClick, onMouseMove }: { onMapClick?: (latlng: [number, number]) => void, onMouseMove?: (latlng: [number, number]) => void }) {
  const onMapClickRef = useRef(onMapClick);
  const onMouseMoveRef = useRef(onMouseMove);
  useEffect(() => { onMapClickRef.current = onMapClick; }, [onMapClick]);
  useEffect(() => { onMouseMoveRef.current = onMouseMove; }, [onMouseMove]);
  
  useMapEvents({
    click(e) {
      if (onMapClickRef.current) {
        onMapClickRef.current([e.latlng.lat, e.latlng.lng]);
      }
    },
    mousemove(e) {
      if (onMouseMoveRef.current) {
        onMouseMoveRef.current([e.latlng.lat, e.latlng.lng]);
      }
    }
  });`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
