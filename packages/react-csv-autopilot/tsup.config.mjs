import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  sourcemap: false,
  target: "es2020",
  external: ["react"],
  esbuildOptions(options) {
    options.platform = "browser";
  },
});
