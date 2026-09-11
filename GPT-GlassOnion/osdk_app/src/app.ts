import Fastify, { type FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { AuditJournal, runFleet } from "./core.js";
import { GeospatialStore, type GeospatialFeatureInput } from "./geospatial.js";
import { readFoundryEnvironment } from "./palantir.js";
import type { SwarmRequest } from "./shared.js";

export interface BuildAppOptions {
  env?: NodeJS.ProcessEnv;
  journal?: AuditJournal;
  geospatialStore?: GeospatialStore;
  logger?: boolean;
  serveStatic?: boolean;
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger ?? false });
  const journal = options.journal ?? new AuditJournal();
  const geospatialStore = options.geospatialStore ?? new GeospatialStore();
  const foundry = readFoundryEnvironment(options.env ?? process.env);

  if (options.serveStatic) {
    await app.register(fastifyStatic, {
      root: path.resolve(process.cwd(), "dist/web"),
      prefix: "/"
    });
  }

  app.get("/api/health", async () => ({
    status: "ok",
    auditValid: journal.verify(),
    foundryConfigured: Boolean(foundry)
  }));

  app.get("/api/audit", async () => journal.events);

  app.get("/api/map.geojson", async (_request, reply) => {
    return reply.type("application/geo+json").send(geospatialStore.toFeatureCollection());
  });

  app.post<{ Body: GeospatialFeatureInput }>("/api/geo/features", async (request, reply) => {
    try {
      const feature = geospatialStore.add(request.body);
      journal.append("geospatial.feature.created", {
        id: String(feature.id),
        geometryType: feature.geometry.type
      });
      return reply.code(201).send(feature);
    } catch (error) {
      return reply.code(400).send({
        error: error instanceof Error ? error.message : "Invalid GeoJSON feature"
      });
    }
  });

  app.post<{ Body: SwarmRequest }>("/api/swarm/run", async (request, reply) => {
    try {
      return await runFleet(request.body.objective, request.body.sources ?? [], journal);
    } catch (error) {
      return reply.code(400).send({
        error: error instanceof Error ? error.message : "Invalid request"
      });
    }
  });

  app.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith("/api/") || !options.serveStatic) {
      return reply.code(404).send({ error: "not_found" });
    }
    return reply.sendFile("index.html");
  });

  return app;
}
