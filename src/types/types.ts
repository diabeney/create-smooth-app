export type Configs = {
  npm: {
    nodeModuleFormat: ModuleFormat;
  };
};

export type ProjectOptions = {
  name: string;
  type: "npm" | "react";
  configs: Configs;
};

export type BuildConfigObj = {
  __ROOT: string;
  projectRootDir: string;
  configName: "tsconfig.json" | "package.json";
  format: ModuleFormat;
};

export type ModuleFormat = "cjs" | "esm";
export type JsonFiles = "package.json" | "tsconfig.json";
