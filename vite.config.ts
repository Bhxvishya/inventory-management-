import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import path from "path";

export default defineConfig({
  build: {
    outDir: "build/client",
  },
  ssr: {
    noExternal: ["remix"],
  },
  plugins: [
    remix({
      basename: "/",
      buildDirectory: "build",
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
});