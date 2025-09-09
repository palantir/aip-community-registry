import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 8080,
    },
    define: {
      process: { env },
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      // Fixing
      // https://github.com/davidtheclark/react-aria-modal/blob/e876665a1744ec4a184abf86cc219fc9fbd2392e/src/react-aria-modal.js#L258C8-L258C24
      "global.document": "document",
    },
  };
});
