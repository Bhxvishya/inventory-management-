import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import path from "path";

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
});