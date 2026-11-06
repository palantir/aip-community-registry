export const WAVE_SIZES = [3, 6, 7, 9] as const;
export type Geometry = GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon;
export interface SourceRef { id: string; title: string; url: string; rightsBasis: "public" | "authorized"; }
export interface Finding { role: string; summary: string; confidence: number; citations: string[]; }
export interface SwarmRequest { objective: string; sources?: SourceRef[]; }
export interface SwarmResult { objective: string; waves: readonly number[]; specialistSlots: 24; totalExecutions: 25; findings: Finding[]; synthesis: Finding; }
export interface Health { status: "ok"; auditValid: boolean; foundryConfigured: boolean; }
