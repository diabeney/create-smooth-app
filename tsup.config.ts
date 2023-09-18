import type { Options } from "tsup";

const config: Options = {
  entry: ["src/index.ts"],
  dts: true,
  target: "esnext",
  format: ["esm"],
  skipNodeModulesBundle: true,
  clean: true,
  treeshake: true,
  minifySyntax: true,
  minifyIdentifiers: true,
};

export default config;
