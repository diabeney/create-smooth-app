import chalk from "chalk";
import { ProjectOptions } from "../types/types";

const logger = {
  success: (msg: string) => chalk.greenBright(msg),
  error: (msg: string) => chalk.redBright(msg),
  info: (msg: string) => chalk.blueBright(msg),
};

function validPackageName(name: string) {
  return /^[a-zA-Z0-9-_.]+$/.test(name);
}

function moduleFormat(obj: ProjectOptions) {
  return obj.configs.npm.nodeModuleFormat;
}

function resolveProjectDir(input: string) {
  let rootDir: string;
  if (input === ".") {
    rootDir = process.cwd();
  } else {
    if (validPackageName(input)) {
      rootDir = input;
    } else {
      throw new Error("Invalid Package name");
    }
  }

  return rootDir;
}

export { logger, resolveProjectDir, moduleFormat };
