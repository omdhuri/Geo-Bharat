import { GeoFeature, Conflict, Change, ProjectStats, Position } from '../types';

const CENTER_LAT = 17.6805;
const CENTER_LNG = 74.0183;
const SPREAD = 0.005;

function randomOffset() {
  return (Math.random() - 0.5) * SPREAD;
}

function generatePolygon(lat: number, lng: number, size: number, points = 4): Position[] {
  const coords: Position[] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = size * (0.8 + Math.random() * 0.4);
    coords.push([lat + Math.sin(angle) * r, lng + Math.cos(angle) * r]);
  }
  coords.push(coords[0]); // close polygon
  return coords;
}

export async function runAnalysis(immediate = false): Promise<{
  features: GeoFeature[];
  conflicts: Conflict[];
  changes: Change[];
  stats: ProjectStats;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const features: GeoFeature[] = [];
      const conflicts: Conflict[] = [];
      const changes: Change[] = [];

      // Generate Farms
      for (let i = 0; i < 63; i++) {
        const lat = CENTER_LAT + randomOffset() * 2;
        const lng = CENTER_LNG + randomOffset() * 2;
        features.push({
          id: `P-${100 + i}`,
          type: 'farm',
          geometry: { type: 'Polygon', coordinates: [generatePolygon(lat, lng, 0.001, 5)] },
          confidence: 85 + Math.random() * 14,
          status: 'pending',
          area: 5000 + Math.random() * 20000,
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      }

      // Generate Buildings
      for (let i = 0; i < 148; i++) {
        const lat = CENTER_LAT + randomOffset();
        const lng = CENTER_LNG + randomOffset();
        features.push({
          id: `B-${1000 + i}`,
          type: 'building',
          geometry: { type: 'Polygon', coordinates: [generatePolygon(lat, lng, 0.00015, 4)] },
          confidence: 80 + Math.random() * 19,
          status: 'pending',
          area: 50 + Math.random() * 300,
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      }
      
      // Generate Roads
      for (let i = 0; i < 27; i++) {
        const lat = CENTER_LAT + randomOffset();
        const lng = CENTER_LNG + randomOffset();
        features.push({
          id: `R-${10 + i}`,
          type: 'road',
          geometry: { 
            type: 'LineString', 
            coordinates: [[lat, lng], [lat + 0.001, lng + 0.001], [lat + 0.002, lng + 0.0015]] 
          },
          confidence: 88 + Math.random() * 10,
          status: 'pending',
          width: 4 + Math.random() * 4,
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      }

      // Generate Water Bodies
      for (let i = 0; i < 3; i++) {
         const lat = CENTER_LAT + randomOffset();
         const lng = CENTER_LNG + randomOffset();
         features.push({
           id: `W-${i+1}`,
           type: 'water',
           geometry: { type: 'Polygon', coordinates: [generatePolygon(lat, lng, 0.002, 8)] },
           confidence: 92 + Math.random() * 7,
           status: 'pending',
           area: 10000 + Math.random() * 50000,
           source: 'ai',
           createdAt: new Date().toISOString(),
         });
      }

      // Generate Trees
      for (let i = 0; i < 421; i++) {
        features.push({
          id: `T-${1000 + i}`,
          type: 'tree',
          geometry: { 
            type: 'Point', 
            coordinates: [CENTER_LAT + randomOffset(), CENTER_LNG + randomOffset()] 
          },
          confidence: 85 + Math.random() * 15,
          status: 'pending',
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      }

      // Generate Conflicts
      conflicts.push({
        id: 'CF-023',
        type: 'boundary_cross',
        severity: 'high',
        confidence: 91,
        affectedFeatureIds: ['B-1045', 'P-112'],
        geometry: { type: 'Point', coordinates: [CENTER_LAT + 0.0005, CENTER_LNG + 0.0005] },
        status: 'pending',
        description: 'Building crosses plot boundary'
      });
      conflicts.push({
        id: 'CF-031',
        type: 'overlap',
        severity: 'medium',
        confidence: 78,
        affectedFeatureIds: ['P-115', 'P-116'],
        geometry: { type: 'Point', coordinates: [CENTER_LAT - 0.001, CENTER_LNG + 0.001] },
        status: 'pending',
        description: 'Plot overlap detected'
      });
      conflicts.push({
        id: 'CF-044',
        type: 'road_buffer',
        severity: 'medium',
        confidence: 63,
        affectedFeatureIds: ['B-1082'],
        geometry: { type: 'Point', coordinates: [CENTER_LAT + 0.0015, CENTER_LNG - 0.001] },
        status: 'pending',
        description: 'Structure inside road right-of-way buffer'
      });
      
      for(let i = 0; i < 8; i++) {
        conflicts.push({
          id: `CF-${100 + i}`,
          type: 'setback',
          severity: Math.random() > 0.5 ? 'low' : 'medium',
          confidence: 60 + Math.random() * 30,
          affectedFeatureIds: [`B-${1100 + i}`],
          geometry: { type: 'Point', coordinates: [CENTER_LAT + randomOffset(), CENTER_LNG + randomOffset()] },
          status: 'pending',
          description: 'Potential setback violation'
        });
      }

      // Generate Changes
      changes.push({
        id: 'CH-041',
        featureType: 'building',
        changeType: 'new',
        confidence: 94,
        geometry: { type: 'Point', coordinates: [CENTER_LAT + 0.002, CENTER_LNG - 0.002] },
        status: 'pending',
        description: 'New building detected since March 2024'
      });
      for(let i=0; i<5; i++) {
         changes.push({
          id: `CH-${100+i}`,
          featureType: i%2===0 ? 'farm' : 'water',
          changeType: 'modified',
          confidence: 80 + Math.random() * 15,
          geometry: { type: 'Point', coordinates: [CENTER_LAT + randomOffset(), CENTER_LNG + randomOffset()] },
          status: 'pending',
          description: 'Boundary modification detected'
        });
      }

      resolve({
        features,
        conflicts,
        changes,
        stats: {
          areaAnalyzed: 48.7,
          totalFeatures: features.length,
          avgConfidence: 91.4,
          pendingReviews: 17,
          totalConflicts: conflicts.length,
          changesDetected: changes.length,
          lulc: {
            'Agriculture': 42.6,
            'Residential': 21.4,
            'Vegetation': 18.2,
            'Water': 6.7,
            'Bare Land': 5.8,
            'Roads': 5.3
          }
        }
      });
    }, immediate ? 0 : 2000); // simulate 2s processing time or instant
  });
}
