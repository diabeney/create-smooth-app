export interface Options {
  projectName: string;
  type: "express" | "npm";
  format: "esm" | "cjs";
  installDeps: boolean;
  packageManager?: "npm" | "pnpm" | "yarn";
}
