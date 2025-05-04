import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/met-api": {
        target: "https://collectionapi.metmuseum.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/met-api/, "/public/collection/v1"),
      },
    },
  },
});
