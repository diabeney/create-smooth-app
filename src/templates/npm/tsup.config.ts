import type { Options } from "tsup";

const config: Options = {
  entry: ["src/index.ts"],
  dts: true,
  target: "esnext",
  skipNodeModulesBundle: true,
  format: ["cjs"],
};

export default config;
