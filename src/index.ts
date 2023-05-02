// import { logger } from "./utils/utils";
import { readdir } from "node:fs/promises";
// import { } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Building static version first

interface IProjectConfigs {
  dir: string;
}

const projectConfigs: IProjectConfigs = {
  dir: "",
};

const PKG_ROOT = join(__dirname, "../");

const projectOpts = {
  name: "diabene",
  stack: "npm",
};

async function getStackDir() {
  const files = await readdir(join(PKG_ROOT, "src/templates"));
  const isValidStack = files.includes(projectOpts.stack);
  if (isValidStack) {
    return join(PKG_ROOT, `src/templates/${projectOpts.stack}`);
  }
}

getStackDir().then((dir) => {
  projectConfigs["dir"] = dir;
});
