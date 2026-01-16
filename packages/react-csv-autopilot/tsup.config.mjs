import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  esbuildOptions(options) {
    options.platform = "browser";
  },
  external: ["react"],
  format: ["esm", "cjs"],
  sourcemap: false,
  target: "es2020",
});
