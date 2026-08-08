import { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { GeoFeature, Conflict, Change } from '../types';
import { cn, formatArea, getConfidenceColor } from '../utils';

// Fix Leaflet's default icon path issues with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom conflict icon
const conflictIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2VmNDQ0NCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMUw4LjUgMi41YTIuMTIgMi4xMiAwIDAgMC0zIDBMMiAxMWExLjUgMS41IDAgMCAwIDAgMmg0djhhMiAyIDAgMCAwIDIgMmgyYTIgMiAwIDAgMCAyLTJ2LTNoMnYzYTIgMiAwIDAgMCAyIDJoMmEyIDIgMCAwIDAgMi0ydi04aDRhMS41IDEuNSAwIDAgMCAwLTJ6Ii8+PC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});


const CENTER = [17.6805, 74.0183] as [number, number];

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}


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

interface GISMapProps {
  features: GeoFeature[];
  conflicts: Conflict[];
  changes: Change[];
  visibleLayers: Record<string, boolean>;
  onFeatureSelect: (feature: GeoFeature | null) => void;
  onConflictSelect: (conflict: Conflict | null) => void;
  selectedFeatureId: string | null;
  selectedConflictId: string | null;
  mapCenter?: [number, number];
  searchMarker?: {lat: number, lon: number, label: string} | null;
  isTracing?: boolean;
  tracingPoints?: [number, number][];
  onMapClick?: (latlng: [number, number]) => void;
}

export default function GISMap({
  features,
  conflicts,
  changes,
  visibleLayers,
  onFeatureSelect,
  onConflictSelect,
  selectedFeatureId,
  selectedConflictId,
  mapCenter,
  searchMarker,
  isTracing,
  tracingPoints,
  onMapClick
}: GISMapProps) {

  const farms = features.filter(f => f.type === 'farm');
  const buildings = features.filter(f => f.type === 'building');
  const roads = features.filter(f => f.type === 'road');
  const trees = features.filter(f => f.type === 'tree');
  const water = features.filter(f => f.type === 'water');

  return (
    <div className="w-full h-full relative bg-white">
      <MapContainer 
        center={CENTER} 
        zoom={16} 
        style={{ width: '100%', height: '100%', background: '#0f172a' }}
        zoomControl={false}
      >
        <MapController center={mapCenter || CENTER} zoom={16} />
        <MapEvents onMapClick={onMapClick} />
        
        {/* Esri World Imagery */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          maxZoom={19}
        />
        {/* Esri Labels */}
        {visibleLayers.labels && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        )}

        {/* Trees */}
        {visibleLayers.trees && trees.map(tree => (
          <CircleMarker
            key={tree.id}
            center={tree.geometry.coordinates as [number, number]}
            radius={3}
            pathOptions={{ 
              color: selectedFeatureId === tree.id ? '#0ea5e9' : '#22c55e', 
              fillColor: '#22c55e', 
              fillOpacity: 0.6,
              weight: selectedFeatureId === tree.id ? 2 : 1
            }}
            eventHandlers={{ click: () => onFeatureSelect(tree) }}
          />
        ))}

        {/* Water */}
        {visibleLayers.water && water.map(w => (
          <Polygon
            key={w.id}
            positions={w.geometry.coordinates as [number, number][]}
            pathOptions={{ 
              color: '#3b82f6', 
              fillColor: '#3b82f6', 
              fillOpacity: 0.4,
              weight: selectedFeatureId === w.id ? 3 : 1
            }}
            eventHandlers={{ click: () => onFeatureSelect(w) }}
          />
        ))}

        {/* Farms */}
        {visibleLayers.farms && farms.map(farm => (
          <Polygon
            key={farm.id}
            positions={farm.geometry.coordinates as [number, number][]}
            pathOptions={{ 
              color: selectedFeatureId === farm.id ? '#0ea5e9' : '#22c55e', 
              fillColor: 'transparent', 
              fillOpacity: 0.1,
              weight: selectedFeatureId === farm.id ? 3 : 2,
              dashArray: '4, 4'
            }}
            eventHandlers={{ click: () => onFeatureSelect(farm) }}
          >
             {/* Add a transparent fill to make it clickable inside */}
             <Polygon
              positions={farm.geometry.coordinates as [number, number][]}
              pathOptions={{ stroke: false, fillColor: '#000000', fillOpacity: 0.01 }}
              eventHandlers={{ click: () => onFeatureSelect(farm) }}
             />
          </Polygon>
        ))}

        {/* Buildings */}
        {visibleLayers.buildings && buildings.map(building => (
          <Polygon
            key={building.id}
            positions={building.geometry.coordinates as [number, number][]}
            pathOptions={{ 
              color: selectedFeatureId === building.id ? '#38bdf8' : '#06b6d4', 
              fillColor: '#0891b2', 
              fillOpacity: 0.5,
              weight: selectedFeatureId === building.id ? 3 : 1
            }}
            eventHandlers={{ click: () => onFeatureSelect(building) }}
          />
        ))}

        {/* Roads */}
        {visibleLayers.roads && roads.map(road => (
          <Polyline
            key={road.id}
            positions={road.geometry.coordinates as [number, number][]}
            pathOptions={{ 
              color: selectedFeatureId === road.id ? '#38bdf8' : '#cbd5e1', 
              weight: selectedFeatureId === road.id ? 6 : 4,
              opacity: 0.8
            }}
            eventHandlers={{ click: () => onFeatureSelect(road) }}
          />
        ))}

        {/* Conflicts */}
        {visibleLayers.conflicts && conflicts.map(conflict => (
          conflict.geometry.type === 'Point' && (
            <CircleMarker
              key={conflict.id}
              center={conflict.geometry.coordinates as [number, number]}
              radius={8}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: selectedConflictId === conflict.id ? 1 : 0.6,
                weight: selectedConflictId === conflict.id ? 4 : 2
              }}
              eventHandlers={{ click: () => onConflictSelect(conflict) }}
            >
              {selectedConflictId !== conflict.id && (
                 <Polygon 
                    positions={[
                      [conflict.geometry.coordinates[0]-0.0002, conflict.geometry.coordinates[1]-0.0002],
                      [conflict.geometry.coordinates[0]+0.0002, conflict.geometry.coordinates[1]-0.0002],
                      [conflict.geometry.coordinates[0]+0.0002, conflict.geometry.coordinates[1]+0.0002],
                      [conflict.geometry.coordinates[0]-0.0002, conflict.geometry.coordinates[1]+0.0002]
                    ] as [number, number][]}
                    pathOptions={{ color: '#ef4444', fill: false, dashArray: '2, 4', weight: 1 }}
                 />
              )}
            </CircleMarker>
          )
        ))}
      
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

      {searchMarker && (
        <Marker position={[searchMarker.lat, searchMarker.lon]}>
          <Popup>{searchMarker.label}</Popup>
        </Marker>
      )}
      </MapContainer>

      {/* Crosshair or overlay styling */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-[400]" />
    </div>
  );
}
