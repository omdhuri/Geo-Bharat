const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  'const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);',
  'const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);\n  const [searchMarker, setSearchMarker] = useState<{lat: number, lon: number, label: string} | null>(null);'
);

appContent = appContent.replace(
  'const { lat, lon } = data[0];\n        setMapCenter([parseFloat(lat), parseFloat(lon)]);',
  'const { lat, lon, display_name } = data[0];\n        setMapCenter([parseFloat(lat), parseFloat(lon)]);\n        setSearchMarker({ lat: parseFloat(lat), lon: parseFloat(lon), label: display_name });'
);

appContent = appContent.replace(
  'mapCenter={mapCenter}',
  'mapCenter={mapCenter}\n          searchMarker={searchMarker}'
);

fs.writeFileSync('src/App.tsx', appContent);

let mapWorkspaceContent = fs.readFileSync('src/pages/MapWorkspace.tsx', 'utf8');

mapWorkspaceContent = mapWorkspaceContent.replace(
  'mapCenter?: [number, number]',
  'mapCenter?: [number, number],\n  searchMarker?: {lat: number, lon: number, label: string} | null'
);

mapWorkspaceContent = mapWorkspaceContent.replace(
  'mapCenter: initialMapCenter',
  'mapCenter: initialMapCenter,\n  searchMarker'
);

mapWorkspaceContent = mapWorkspaceContent.replace(
  'mapCenter={mapCenter}',
  'mapCenter={mapCenter}\n            searchMarker={searchMarker}'
);

fs.writeFileSync('src/pages/MapWorkspace.tsx', mapWorkspaceContent);

let mapContainerContent = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

mapContainerContent = mapContainerContent.replace(
  'mapCenter?: [number, number];',
  'mapCenter?: [number, number];\n  searchMarker?: {lat: number, lon: number, label: string} | null;'
);

mapContainerContent = mapContainerContent.replace(
  'mapCenter\n}: GISMapProps)',
  'mapCenter,\n  searchMarker\n}: GISMapProps)'
);

mapContainerContent = mapContainerContent.replace(
  '{/* Crosshair or overlay styling */}',
  '{searchMarker && (\n        <Marker position={[searchMarker.lat, searchMarker.lon]}>\n          <Popup>{searchMarker.label}</Popup>\n        </Marker>\n      )}\n      {/* Crosshair or overlay styling */}'
);

fs.writeFileSync('src/components/map/MapContainer.tsx', mapContainerContent);

console.log("Done");
