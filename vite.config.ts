import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import path from "path";

export default defineConfig({
  build: {
    outDir: "build/client",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js"
      }
    }
  },
  ssr: {
    noExternal: ["remix"],
  },
  plugins: [
    remix({
      basename: "/",
      buildDirectory: "build",
      serverModuleFormat: "esm",
      ignoredRouteFiles: ["**/.*"],
      assetsBuildDirectory: "build/client/assets",
      publicPath: "/build/"
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
});