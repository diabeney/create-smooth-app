#!/usr/bin/env node
import * as fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  openJSONSync,
  moduleFormat,
  configNameAndPath,
  buildTsupConfig,
  resolveProjectDir,
} from "./utils/utils";
import { BuildConfigObj, ProjectOptions, JsonFiles } from "./types/types";
import { CLI } from "./cli/cli";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PKG_ROOT = join(__dirname, "../");

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

function scaffoldProject(pkgDir: string, name: string) {
  const userDir = resolveProjectDir(name, __dirname);
  fs.mkdirSync(userDir);
  composeFilesAndDir(pkgDir, userDir);
}

(async () => {
  const projectOptions = (await CLI.Run()) as ProjectOptions;
  const { name } = projectOptions;
  const projectDir = getTmplDir(projectOptions);
  buildConfigs(projectOptions, projectDir);
  scaffoldProject(projectDir, name);
})();
