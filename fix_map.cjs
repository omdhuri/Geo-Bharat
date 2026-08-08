const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(
  '      </MapContainer>\n      {searchMarker && (\n        <Marker position={[searchMarker.lat, searchMarker.lon]}>\n          <Popup>{searchMarker.label}</Popup>\n        </Marker>\n      )}',
  '      {searchMarker && (\n        <Marker position={[searchMarker.lat, searchMarker.lon]}>\n          <Popup>{searchMarker.label}</Popup>\n        </Marker>\n      )}\n      </MapContainer>'
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);
