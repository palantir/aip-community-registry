import { buildApp } from "./app.js";

const app = await buildApp({ logger: true, serveStatic: true });
await app.listen({
  port: Number(process.env.PORT ?? 8787),
  host: "0.0.0.0"
});
