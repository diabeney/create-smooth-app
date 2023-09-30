#!/user/bin/env node

import { Options } from "./types/types.js";
import { installPackages, logger, resolveProjectDir } from "./utils/main.js";
import { mkdirSync, statSync, existsSync } from "fs";
import { copyFileSync } from "fs";
import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { openJSONSync } from "./utils/main.js";
import { CLI } from "./cli/cli.js";
import { buildTsupConfig } from "./utils/main.js";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

function getTmplDir(projectType: Options["type"]) {
  return join(__dirName, "templates", projectType);
}

function createFilesSync(entryDir: string, newDir: string) {
  const files = readdirSync(entryDir);
  for (const file of files) {
    const filePath = join(entryDir, file);
    const fileStat = statSync(filePath);
    if (fileStat.isFile()) {
      const fileName = file.startsWith("_") ? file.replace("_", ".") : file;
      copyFileSync(filePath, join(newDir, fileName));
    }

    if (fileStat.isDirectory()) {
      const subDir = join(newDir, file);
      mkdirSync(subDir);
      createFilesSync(filePath, subDir);
    }
  }
}

function buildConfigs(projectRoot: string, { type, format }: Options) {
  const pkgJsonPath = join(__dirName, "configs", "package");
  const tsJsonPath = join(__dirName, "configs", "typescript");
  const pkgJsonconfigFile = join(
    pkgJsonPath,
    `package.${type === "express" ? type : format}.json`
  );
  const tsJsonconfigFile = join(
    tsJsonPath,
    `tsconfig.${type === "express" ? "esm" : format}.json`
  );
  const configsObj = [
    {
      name: "tsconfig.json",
      tmplDir: tsJsonconfigFile,
    },
    {
      name: "package.json",
      tmplDir: pkgJsonconfigFile,
    },
  ];
  configsObj.forEach(({ name, tmplDir }) => {
    openJSONSync(join(projectRoot, name), tmplDir);
  });
  buildTsupConfig(projectRoot, format);
}

async function scaffoldProject(
  projectOptions: Options,
  cb: (obj: Options) => void
) {
  const { projectName, type } = projectOptions;
  const dir = resolveProjectDir(projectName);
  if (!existsSync(dir)) mkdirSync(dir);
  const templateDir = getTmplDir(type);
  createFilesSync(templateDir, dir);
  buildConfigs(dir, projectOptions);
  cb(projectOptions);
}

function resolveSuccess({ installDeps, projectName, packageManager }: Options) {
  try {
    if (installDeps) {
      installPackages(packageManager);
    } else {
      console.log(
        `\n\n ${logger.success(
          "Project created successfully!"
        )}\n\n Now Run, \n\n cd ${projectName} \n npm install`
      );
    }
  } catch (err) {
    console.log("Something went wrong...\n", err);
  }
}

(async () => {
  const answers = await CLI();
  scaffoldProject(answers, resolveSuccess);
})();
