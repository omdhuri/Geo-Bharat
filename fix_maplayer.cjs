const fs = require('fs');

let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

content = content.replace(
  '        {/* Esri World Imagery */}\n        <TileLayer\n          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"\n          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"\n          maxZoom={19}\n        />',
  '        {/* Esri World Imagery */}\n        <TileLayer\n          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"\n          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"\n          maxZoom={19}\n        />\n        {/* Esri Labels */}\n        {visibleLayers.labels && (\n          <TileLayer\n            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"\n            maxZoom={19}\n          />\n        )}'
);

fs.writeFileSync('src/components/map/MapContainer.tsx', content);

console.log("Done");
