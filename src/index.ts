#!/usr/bin/env node
import * as fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  openJSONSync,
  moduleFormat,
  configNameAndPath,
  buildTsupConfig,
} from "./utils/utils";
import { BuildConfigObj, ProjectOptions, JsonFiles } from "./types/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PKG_ROOT = join(__dirname, "../");

const projectOpts: ProjectOptions = {
  name: "diabene",
  type: "npm",
  configs: {
    npm: {
      nodeModuleFormat: "cjs",
    },
  },
};

function buildConfigs(projectOpts: ProjectOptions, rootDir: string) {
  const format = moduleFormat(projectOpts);
  const jsonFiles: JsonFiles[] = ["tsconfig.json", "package.json"];
  const jsonFilesObj = jsonFiles.map(
    (file): BuildConfigObj => ({
      __ROOT: PKG_ROOT,
      projectRootDir: rootDir,
      configName: file,
      format: format,
    })
  );

  try {
    buildTsupConfig(rootDir, format);
    jsonFilesObj.forEach((json) => {
      const { configNamePath, path } = configNameAndPath(json);
      openJSONSync(configNamePath, path);
    });
  } catch (err) {
    console.log("error");
  }
}

function getTmplDir(options: ProjectOptions) {
  const files = fs.readdirSync(join(PKG_ROOT, "src/templates"));
  const isValidType = files.includes(options.type);
  if (isValidType) {
    return join(PKG_ROOT, `src/templates/${options.type}`);
  }
}

function composeFilesAndDir(dir: string, newDir: string) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fpath = join(dir, file);
      const fstat = fs.statSync(fpath);
      if (fstat.isFile()) {
        const formmatedFileName = file.startsWith("_")
          ? file.replace("_", ".")
          : file;
        const data = fs.readFileSync(fpath, "utf-8");
        fs.writeFileSync(join(newDir, formmatedFileName), data, "utf-8");
      }
      if (fstat.isDirectory()) {
        const subDir = join(newDir, file);
        fs.mkdirSync(subDir);
        composeFilesAndDir(fpath, subDir);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function scaffoldProject(pkgDir: string) {
  const userDir = join(__dirname, "new-app");
  fs.mkdirSync(userDir);
  composeFilesAndDir(pkgDir, userDir);
}

(() => {
  const projectDir = getTmplDir(projectOpts);
  buildConfigs(projectOpts, projectDir);
  scaffoldProject(projectDir);
})();
