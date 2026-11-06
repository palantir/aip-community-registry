import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist/web", sourcemap: true },
  server: { port: 8080, proxy: { "/api": "http://localhost:8787" } },
});
