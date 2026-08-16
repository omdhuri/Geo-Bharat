import { GeoFeature, Conflict, Change, ProjectStats, Position } from '../types';
import osm from '../data/geobharat-osm.json';

const CENTER_LAT = osm.center[0];
const CENTER_LNG = osm.center[1];
const M_PER_DEG_LAT = 111320;
const M_PER_DEG_LNG = 111320 * Math.cos((CENTER_LAT * Math.PI) / 180);

function toMeters([lat, lng]: Position): [number, number] {
  return [(lng - CENTER_LNG) * M_PER_DEG_LNG, (lat - CENTER_LAT) * M_PER_DEG_LAT];
}

function pointToSegmentDistM(p: Position, a: Position, b: Position): number {
  const [px, py] = toMeters(p);
  const [ax, ay] = toMeters(a);
  const [bx, by] = toMeters(b);
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function ringToPoints(ring: Position[]): Position[] {
  return ring;
}

function pointInRing(pt: Position, ring: Position[]): boolean {
  const [x, y] = pt;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function ringBounds(ring: Position[]) {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const [lat, lng] of ring) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  return { minLat, maxLat, minLng, maxLng };
}

function samplePointsInRing(ring: Position[], count: number, rand: () => number): Position[] {
  const { minLat, maxLat, minLng, maxLng } = ringBounds(ring);
  const pts: Position[] = [];
  let attempts = 0;
  while (pts.length < count && attempts < count * 40) {
    attempts++;
    const lat = minLat + rand() * (maxLat - minLat);
    const lng = minLng + rand() * (maxLng - minLng);
    if (pointInRing([lat, lng], ring)) pts.push([lat, lng]);
  }
  return pts;
}

// Deterministic-ish PRNG so each "Run Analysis" pass still varies slightly without being fully chaotic
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function runAnalysis(immediate = false): Promise<{
  features: GeoFeature[];
  conflicts: Conflict[];
  changes: Change[];
  stats: ProjectStats;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rand = mulberry32(Date.now() & 0xffffffff);
      const features: GeoFeature[] = [];

      // Buildings — real footprints from OpenStreetMap
      osm.buildings.forEach((b, i) => {
        features.push({
          id: `B-${1000 + i}`,
          type: 'building',
          geometry: { type: 'Polygon', coordinates: [b.ring as Position[]] },
          confidence: 80 + rand() * 19,
          status: 'pending',
          area: b.area,
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      });

      // Parcels (residential/farmland/greenfield plots) — real boundaries
      osm.parcels.forEach((p, i) => {
        features.push({
          id: `P-${100 + i}`,
          type: 'farm',
          geometry: { type: 'Polygon', coordinates: [p.ring as Position[]] },
          confidence: 85 + rand() * 14,
          status: 'pending',
          area: p.area,
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      });

      // Water bodies — real
      osm.water.forEach((w, i) => {
        features.push({
          id: `W-${i + 1}`,
          type: 'water',
          geometry: { type: 'Polygon', coordinates: [w.ring as Position[]] },
          confidence: 92 + rand() * 7,
          status: 'pending',
          area: w.area,
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      });
      // Streams/waterways — real, rendered as lines rather than filled bodies
      (osm.waterways || []).forEach((w, i) => {
        features.push({
          id: `W-S${i + 1}`,
          type: 'water',
          geometry: { type: 'LineString', coordinates: w.line as Position[] },
          confidence: 90 + rand() * 8,
          status: 'pending',
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      });

      // Roads — real centerlines
      osm.roads.forEach((r, i) => {
        const widthByClass: Record<string, number> = {
          trunk: 12, trunk_link: 8, primary: 10, secondary: 8, tertiary: 7,
          residential: 5, service: 3.5, unclassified: 4, path: 1.5,
        };
        features.push({
          id: `R-${10 + i}`,
          type: 'road',
          geometry: { type: 'LineString', coordinates: r.line as Position[] },
          confidence: 88 + rand() * 10,
          status: 'pending',
          width: (widthByClass[r.cls] || 5) + rand() * 1.5,
          source: 'ai',
          createdAt: new Date().toISOString(),
        });
      });

      // Trees — scattered within real vegetation/park footprints (dense) and within real plot
      // boundaries (sparser, like compound/street trees), never floating over open ground
      let treeIdx = 0;
      const scatterTrees = (poly: { ring: Position[] | number[][]; area?: number }, density: number) => {
        const areaFraction = Math.min(1, (poly.area || 400) / 5000);
        const n = Math.max(2, Math.round(areaFraction * density));
        const pts = samplePointsInRing(poly.ring as Position[], n, rand);
        pts.forEach(pt => {
          features.push({
            id: `T-${1000 + treeIdx++}`,
            type: 'tree',
            geometry: { type: 'Point', coordinates: pt },
            confidence: 85 + rand() * 15,
            status: 'pending',
            source: 'ai',
            createdAt: new Date().toISOString(),
          });
        });
      };
      osm.vegetation.forEach(poly => scatterTrees(poly, 60));
      osm.parcels.forEach(poly => scatterTrees(poly, 18));

      // --- Spatial conflicts, computed from real geometry ---
      const conflicts: Conflict[] = [];
      const buildingFeatures = features.filter(f => f.type === 'building');

      // Setback: buildings whose closest wall point sits nearest to a road centerline
      const setbackCandidates = buildingFeatures.map(b => {
        const ring = (b.geometry.coordinates[0] as Position[]);
        let minDist = Infinity;
        for (const r of osm.roads) {
          const line = r.line as Position[];
          for (let i = 0; i < line.length - 1; i++) {
            for (const vertex of ring) {
              const d = pointToSegmentDistM(vertex, line[i], line[i + 1]);
              if (d < minDist) minDist = d;
            }
          }
        }
        return { building: b, minDist };
      }).sort((a, b) => a.minDist - b.minDist);

      setbackCandidates.slice(0, 12).forEach((c, i) => {
        const center = (c.building.geometry.coordinates[0] as Position[])[0];
        conflicts.push({
          id: `CF-${100 + i}`,
          type: 'setback',
          severity: c.minDist < 1.5 ? 'high' : c.minDist < 3 ? 'medium' : 'low',
          confidence: 60 + rand() * 30,
          affectedFeatureIds: [c.building.id],
          geometry: { type: 'Point', coordinates: center },
          status: 'pending',
          description: `Structure ${c.minDist.toFixed(1)}m from road right-of-way`,
        });
      });

      // Adjacency / overlap: nearest building-to-building pairs (rowhouses sharing walls, near-touching plots)
      type Pair = { a: GeoFeature; b: GeoFeature; dist: number };
      const pairs: Pair[] = [];
      for (let i = 0; i < buildingFeatures.length; i++) {
        const ringA = buildingFeatures[i].geometry.coordinates[0] as Position[];
        const [alat, alng] = ringA[0];
        for (let j = i + 1; j < buildingFeatures.length; j++) {
          const ringB = buildingFeatures[j].geometry.coordinates[0] as Position[];
          const [blat, blng] = ringB[0];
          const roughM = Math.hypot((alat - blat) * M_PER_DEG_LAT, (alng - blng) * M_PER_DEG_LNG);
          if (roughM > 25) continue; // cheap prefilter
          let minDist = Infinity;
          for (const pa of ringA) for (const pb of ringB) {
            const [ax, ay] = toMeters(pa);
            const [bx, by] = toMeters(pb);
            const d = Math.hypot(ax - bx, ay - by);
            if (d < minDist) minDist = d;
          }
          pairs.push({ a: buildingFeatures[i], b: buildingFeatures[j], dist: minDist });
        }
      }
      pairs.sort((a, b) => a.dist - b.dist);
      pairs.slice(0, 7).forEach((p, i) => {
        const ringA = p.a.geometry.coordinates[0] as Position[];
        conflicts.push({
          id: `CF-0${20 + i}`,
          type: p.dist < 0.5 ? 'boundary_cross' : 'overlap',
          severity: p.dist < 0.5 ? 'high' : 'medium',
          confidence: 70 + rand() * 25,
          affectedFeatureIds: [p.a.id, p.b.id],
          geometry: { type: 'Point', coordinates: ringA[0] },
          status: 'pending',
          description: p.dist < 0.5 ? 'Adjoining structures share/cross plot boundary' : 'Structures encroach on shared setback',
        });
      });

      // Water buffer: buildings closest to a real water body/stream edge
      const waterFeatures = features.filter(f => f.type === 'water');
      if (waterFeatures.length > 0) {
        const waterCandidates = buildingFeatures.map(b => {
          const ring = b.geometry.coordinates[0] as Position[];
          let minDist = Infinity;
          for (const w of waterFeatures) {
            const wCoords = w.geometry.type === 'LineString'
              ? [w.geometry.coordinates as Position[]]
              : (w.geometry.coordinates as Position[][]);
            for (const line of wCoords) {
              for (let i = 0; i < line.length - 1; i++) {
                for (const vertex of ring) {
                  const d = pointToSegmentDistM(vertex, line[i], line[i + 1]);
                  if (d < minDist) minDist = d;
                }
              }
            }
          }
          return { building: b, minDist };
        }).sort((a, b) => a.minDist - b.minDist);

        waterCandidates.slice(0, 5).forEach((c, i) => {
          const center = (c.building.geometry.coordinates[0] as Position[])[0];
          conflicts.push({
            id: `CF-0${40 + i}`,
            type: 'water_buffer',
            severity: c.minDist < 5 ? 'high' : c.minDist < 12 ? 'medium' : 'low',
            confidence: 62 + rand() * 28,
            affectedFeatureIds: [c.building.id],
            geometry: { type: 'Point', coordinates: center },
            status: 'pending',
            description: `Structure ${c.minDist.toFixed(1)}m from water body buffer`,
          });
        });
      }

      // --- Changes (for Change Detection view) — anchored to real footprints ---
      const changes: Change[] = [];
      const changeBuildingIdx = [8, 24, 45, 62, 80, 97, 115, 130, 150, 170, 188, 205]
        .filter(i => i < osm.buildings.length);
      changeBuildingIdx.forEach((idx, i) => {
        const b = osm.buildings[idx];
        if (i === 0) {
          changes.push({
            id: 'CH-041',
            featureType: 'building',
            changeType: 'new',
            confidence: 94,
            geometry: { type: 'Polygon', coordinates: [b.ring as Position[]] },
            status: 'pending',
            description: 'New building detected since March 2024',
          });
        } else if (i % 5 === 0) {
          changes.push({
            id: `CH-2${i.toString().padStart(2, '0')}`,
            featureType: 'building',
            changeType: 'removed',
            confidence: 75 + rand() * 20,
            geometry: { type: 'Polygon', coordinates: [b.ring as Position[]] },
            status: 'pending',
            description: 'Structure no longer present since March 2024',
          });
        } else if (i % 3 === 0) {
          changes.push({
            id: `CH-3${i.toString().padStart(2, '0')}`,
            featureType: 'building',
            changeType: 'new',
            confidence: 78 + rand() * 18,
            geometry: { type: 'Polygon', coordinates: [b.ring as Position[]] },
            status: 'pending',
            description: 'New structure detected since March 2024',
          });
        } else {
          changes.push({
            id: `CH-${100 + i - 1}`,
            featureType: 'building',
            changeType: 'modified',
            confidence: 80 + rand() * 15,
            geometry: { type: 'Polygon', coordinates: [b.ring as Position[]] },
            status: 'pending',
            description: 'Structure footprint expanded since March 2024',
          });
        }
      });

      const stats: ProjectStats = {
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
          'Roads': 5.3,
        },
      };

      resolve({ features, conflicts, changes, stats });
    }, immediate ? 0 : 2000);
  });
}
