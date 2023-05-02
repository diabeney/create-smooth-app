import type { Options } from "tsup";

const config: Options = {
  entry: ["src/**/*"],
  dts: true,
  target: "es2016",
  sourcemap: true,
  format: ["cjs", "esm", "iife"],
};

export default config;
