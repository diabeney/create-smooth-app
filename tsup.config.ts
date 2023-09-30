import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli/cli.ts"],
  clean: true,
  publicDir: "public",
  format: ["esm"],
  target: "esnext",
  minifySyntax: true,
});
