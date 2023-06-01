#!/usr/bin/env node

import * as fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ProjectOptions } from "./types/types";
import { moduleFormat } from "./utils/utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PKG_ROOT = join(__dirname, "../");

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
  const configName = join(rootDir, "tsconfig.json");
  const moduleFormatConfig = join(
    PKG_ROOT,
    `src/templates/configs/Typescript/tsconfig.${format}.json`
  );
  try {
    const content = fs.readFileSync(moduleFormatConfig, "utf-8");
    const jsonData = JSON.parse(content);
    fs.writeFileSync(configName, JSON.stringify(jsonData, null, 2));
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
