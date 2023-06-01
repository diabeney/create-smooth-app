import type { Options } from "tsup";

const config: Options = {
  entry: ["src/**/*"],
  dts: true,
  target: "esnext",
  sourcemap: true,
  format: ["cjs"],
};

export default config;
