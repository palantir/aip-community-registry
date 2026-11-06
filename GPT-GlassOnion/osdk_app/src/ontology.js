import { randomUUID } from "node:crypto";

const geometryTypes = new Set(["Point", "LineString", "Polygon"]);
export function validateGeometry(geometry) {
  if (!geometry || !geometryTypes.has(geometry.type) || !Array.isArray(geometry.coordinates)) {
    throw new Error("Invalid or unsupported GeoJSON geometry");
  }
  if (geometry.type === "Point") {
    const [longitude, latitude] = geometry.coordinates;
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude) ||
        longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      throw new Error("Invalid WGS84 point");
    }
  }
  return geometry;
}

export class Ontology {
  constructor(journal) {
    this.journal = journal;
    this.types = new Map();
    this.objects = new Map();
    this.links = new Map();
  }
  defineType(definition, actor = "system") {
    if (!definition?.id || !definition?.properties) throw new Error("Type requires id and properties");
    this.types.set(definition.id, structuredClone(definition));
    this.journal.append("ontology.type.defined", actor, { typeId: definition.id });
  }
  create(typeId, properties, { id = randomUUID(), sourceId, actor = "system" } = {}) {
    if (!this.types.has(typeId)) throw new Error(`Unknown type: ${typeId}`);
    if (properties.geometry) validateGeometry(properties.geometry);
    const object = { id, typeId, properties: structuredClone(properties), sourceId, version: 1 };
    this.objects.set(id, object);
    this.journal.append("ontology.object.created", actor, { id, typeId, sourceId });
    return object;
  }
  link(type, leftId, rightId, properties = {}, actor = "system") {
    if (!this.objects.has(leftId) || !this.objects.has(rightId)) throw new Error("Link endpoints must exist");
    const link = { id: randomUUID(), type, leftId, rightId, properties };
    this.links.set(link.id, link);
    this.journal.append("ontology.link.created", actor, link);
    return link;
  }
  toJSON() { return { types: [...this.types.values()], objects: [...this.objects.values()], links: [...this.links.values()] }; }
  toGeoJSON() {
    return { type: "FeatureCollection", features: [...this.objects.values()]
      .filter(object => object.properties.geometry)
      .map(object => ({ type: "Feature", id: object.id, geometry: object.properties.geometry,
        properties: { ...object.properties, geometry: undefined, ontologyType: object.typeId, sourceId: object.sourceId } })) };
  }
}

export function installCoreTypes(ontology) {
  [
    { id: "KnowledgeSource", properties: { title: "string", url: "string", kind: "string", checksum: "string" } },
    { id: "Place", properties: { name: "string", geometry: "geojson" } },
    { id: "Observation", properties: { statement: "string", geometry: "geojson?", confidence: "number" } },
    { id: "Agent", properties: { role: "string", slot: "number", wave: "number" } },
    { id: "Finding", properties: { summary: "string", confidence: "number", citations: "string[]" } }
  ].forEach(type => ontology.defineType(type));
}
