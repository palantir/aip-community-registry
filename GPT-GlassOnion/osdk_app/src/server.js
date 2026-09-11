import http from "node:http";
import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.PORT ?? 8787);
function send(res, status, value, type = "application/json") {
  res.writeHead(status, { "content-type": `${type}; charset=utf-8` });
  res.end(type === "application/json" ? JSON.stringify(value, null, 2) : value);
}
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}
http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") return send(res, 200, { status: "ok", auditValid: app.journal.verify() });
    if (req.method === "GET" && req.url === "/ontology") return send(res, 200, app.ontology.toJSON());
    if (req.method === "GET" && req.url === "/map.geojson") return send(res, 200, app.ontology.toGeoJSON(), "application/geo+json");
    if (req.method === "GET" && req.url === "/audit") return send(res, 200, app.journal.list());
    if (req.method === "POST" && req.url === "/swarm/run") {
      const input = await readBody(req);
      return send(res, 200, await app.fleet.run(input.objective, input.sources ?? []));
    }
    return send(res, 404, { error: "not_found" });
  } catch (error) {
    return send(res, 400, { error: error.message });
  }
}).listen(port, () => console.log(`GPT-GlassOnion listening on ${port}`));
