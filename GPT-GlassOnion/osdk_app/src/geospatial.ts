import { randomUUID } from "node:crypto";
import type { Geometry } from "./shared.js";

function isPosition(value: unknown): value is GeoJSON.Position {
  if (!Array.isArray(value) || value.length < 2 || !value.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate))) {
    return false;
  }
  const [longitude, latitude] = value;
  return longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
}

function samePosition(left: GeoJSON.Position, right: GeoJSON.Position): boolean {
  return left.length === right.length && left.every((coordinate, index) => coordinate === right[index]);
}

export function validateGeometry(value: unknown): Geometry {
  if (!value || typeof value !== "object") {
    throw new Error("Geometry is required");
  }
  const geometry = value as { type?: unknown; coordinates?: unknown };
  if (geometry.type === "Point") {
    if (!isPosition(geometry.coordinates)) throw new Error("Invalid WGS84 Point coordinates");
    return structuredClone(geometry) as Geometry;
  }
  if (geometry.type === "LineString") {
    if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length < 2 || !geometry.coordinates.every(isPosition)) {
      throw new Error("LineString requires at least two valid WGS84 positions");
    }
    return structuredClone(geometry) as Geometry;
  }
  if (geometry.type === "Polygon") {
    if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
      throw new Error("Polygon requires at least one linear ring");
    }
    const valid = geometry.coordinates.every((candidate) => {
      if (!Array.isArray(candidate) || candidate.length < 4 || !candidate.every(isPosition)) return false;
      return samePosition(candidate[0], candidate[candidate.length - 1]);
    });
    if (!valid) throw new Error("Polygon rings require four valid WGS84 positions and must be closed");
    return structuredClone(geometry) as Geometry;
  }
  throw new Error("Only Point, LineString, and Polygon geometries are supported");
}

export interface GeospatialFeatureInput {
  id?: string | number;
  geometry: unknown;
  properties?: Record<string, unknown>;
}

export class GeospatialStore {
  readonly #features = new Map<string | number, GeoJSON.Feature<Geometry>>();

  add(input: GeospatialFeatureInput): GeoJSON.Feature<Geometry> {
    if (!input || typeof input !== "object") throw new Error("GeoJSON feature input is required");
    const id = input.id ?? randomUUID();
    const feature: GeoJSON.Feature<Geometry> = {
      type: "Feature",
      id,
      geometry: validateGeometry(input.geometry),
      properties: structuredClone(input.properties ?? {})
    };
    this.#features.set(id, feature);
    return structuredClone(feature);
  }

  toFeatureCollection(): GeoJSON.FeatureCollection<Geometry> {
    return {
      type: "FeatureCollection",
      features: [...this.#features.values()].map((feature) => structuredClone(feature))
    };
  }
}
