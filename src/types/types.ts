export interface Configs {
  npm: {
    nodeModuleFormat: "cjs" | "esm";
  };
}

export interface ProjectOptions {
  name: string;
  type: "npm" | "react";
  configs: Configs;
}
