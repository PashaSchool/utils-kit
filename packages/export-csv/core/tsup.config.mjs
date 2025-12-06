import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/worker.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  target: "es2020",
  sourcemap: false,
  splitting: false,
  outDir: "dist",
  esbuildOptions(options) {
    options.platform = "browser";
  },
});
