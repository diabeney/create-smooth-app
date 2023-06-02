import type { Options } from "tsup";

const config: Options = {
  entry: ["src/**/*"],
  dts: true,
  target: "esnext",
  sourcemap: true,
};

export default config;
