export type Position = [number, number]; // [lat, lng]

export type FeatureType = 'farm' | 'building' | 'road' | 'tree' | 'water' | 'lulc';
export type FeatureStatus = 'pending' | 'accepted' | 'rejected' | 'flagged';

export interface GeoFeature {
  id: string;
  type: FeatureType;
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon';
    coordinates: Position | Position[] | Position[][];
  };
  confidence: number;
  status: FeatureStatus;
  area?: number; // sqm
  width?: number; // m
  label?: string;
  source: 'ai' | 'manual';
  createdAt: string;
}

export type ConflictType = 
  | 'overlap' 
  | 'boundary_cross' 
  | 'road_buffer' 
  | 'water_buffer' 
  | 'setback' 
  | 'low_confidence';
  
export type ConflictSeverity = 'high' | 'medium' | 'low';

export interface Conflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  confidence: number;
  affectedFeatureIds: string[];
  geometry: {
    type: 'Point' | 'Polygon';
    coordinates: Position | Position[][];
  };
  status: 'pending' | 'resolved';
  description: string;
}

export interface Change {
  id: string;
  featureType: FeatureType;
  changeType: 'new' | 'modified' | 'removed';
  confidence: number;
  status: 'pending' | 'reviewed';
  geometry: {
    type: 'Point' | 'Polygon';
    coordinates: Position | Position[][];
  };
  description: string;
}

export interface ProjectStats {
  areaAnalyzed: number; // sq km
  totalFeatures: number;
  avgConfidence: number;
  pendingReviews: number;
  totalConflicts: number;
  changesDetected: number;
  lulc: Record<string, number>;
}
