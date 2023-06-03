import type { Options } from "tsup";

const config: Options = {
  entry: ["src/index.ts"],
  dts: true,
  target: "esnext",
  format: ["esm"],
  skipNodeModulesBundle: true,
};

export default config;
