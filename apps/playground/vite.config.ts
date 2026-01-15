import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["export-csv-core", "react-url-query-params"],
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "../../packages"), path.resolve(__dirname)],
    },
  },
  resolve: {
    alias: {
      // force imports to point at source files
      "react-url-query-params": path.resolve(
        __dirname,
        "../../packages/react-url-query-params/src",
      ),
      "export-csv-core": path.resolve(__dirname, "../../packages/export-csv/core/src"),
    },
    // keep symlinks so Vite sees real paths and watches them
    preserveSymlinks: true,
  },
});
