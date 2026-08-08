const fs = require('fs');
let content = fs.readFileSync('src/components/map/MapContainer.tsx', 'utf8');

const target = `                  <Polygon 
                    positions={[
                      [conflict.geometry.coordinates[0]-0.0002, conflict.geometry.coordinates[1]-0.0002],
                      [conflict.geometry.coordinates[0]+0.0002, conflict.geometry.coordinates[1]-0.0002],
                      [conflict.geometry.coordinates[0]+0.0002, conflict.geometry.coordinates[1]+0.0002],
                      [conflict.geometry.coordinates[0]-0.0002, conflict.geometry.coordinates[1]+0.0002]
                    ] as [number, number][]}`;

const replacement = `                  <Polygon 
                    positions={[
                      [(conflict.geometry.coordinates as [number, number])[0]-0.0002, (conflict.geometry.coordinates as [number, number])[1]-0.0002],
                      [(conflict.geometry.coordinates as [number, number])[0]+0.0002, (conflict.geometry.coordinates as [number, number])[1]-0.0002],
                      [(conflict.geometry.coordinates as [number, number])[0]+0.0002, (conflict.geometry.coordinates as [number, number])[1]+0.0002],
                      [(conflict.geometry.coordinates as [number, number])[0]-0.0002, (conflict.geometry.coordinates as [number, number])[1]+0.0002]
                    ] as [number, number][]}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/map/MapContainer.tsx', content);
console.log("Done");
