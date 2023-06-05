import chalk from "chalk";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
import { ModuleFormat, JsonFiles, ProjectOptions } from "../types/types";

const logger = {
  success: (msg: string) => console.log(chalk.greenBright(msg)),
  error: (msg: string) => console.log(chalk.redBright(msg)),
  info: (msg: string) => console.log(chalk.blueBright(msg)),
};

function validPackageName(name: string) {
  return /^[a-zA-Z0-9-_.]+$/.test(name);
}

function buildTsupConfig(projectRoot: string, format: ModuleFormat) {
  const configContent = `import type { Options } from "tsup";

const config: Options = {
  entry: ["src/index.ts"],
  dts: true,
  target: "esnext",
  skipNodeModulesBundle: true,
  format: ["${format}"],
};

export default config;
`;

  const configBuffer = Buffer.from(configContent, "utf-8");
  writeFileSync(join(projectRoot, "tsup.config.ts"), configBuffer, "utf-8");
}

function generateConfigPath(
  root: string,
  format: ModuleFormat,
  type: JsonFiles
) {
  if (type === "tsconfig.json") {
    return join(root, `/templates/configs/Typescript/tsconfig.${format}.json`);
  }
  return join(root, `/templates/configs/Package/package.${format}.json`);
}

function openJSONSync(configName: string, configDir: string) {
  const content = readFileSync(configDir, "utf-8");
  const jsonData = JSON.parse(content);
  writeFileSync(configName, JSON.stringify(jsonData, null, 2));
}

function configNameAndPath({ projectRootDir, configName, __ROOT, format }) {
  const configNamePath = join(projectRootDir, configName);
  const path = generateConfigPath(__ROOT, format, configName);
  return { configNamePath, path };
}

function moduleFormat(obj: ProjectOptions) {
  return obj.configs.npm.nodeModuleFormat;
}

function resolveProjectDir(input: string, dirname: string) {
  let rootDir: string;
  if (input === ".") {
    rootDir = process.cwd();
  } else {
    rootDir = join(dirname, input);
  }
  return rootDir;
}

export {
  logger,
  resolveProjectDir,
  moduleFormat,
  generateConfigPath,
  configNameAndPath,
  openJSONSync,
  buildTsupConfig,
  validPackageName,
};
