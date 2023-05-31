import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
// import { resolveProjectDir } from "./utils/utils";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Building static version first

const PKG_ROOT = join(__dirname, "../");

const projectOpts = {
  name: "diabene",
  type: "npm",
};

async function getTmplDir() {
  const files = await readdir(join(PKG_ROOT, "src/templates"));
  const isValidStack = files.includes(projectOpts.type);
  if (isValidStack) {
    return join(PKG_ROOT, `src/templates/${projectOpts.type}`);
  }
}

async function composeFilesAndDir(dir: string, newDir: string) {
  try {
    const files = await readdir(dir);
    for (const file of files) {
      const fpath = join(dir, file);
      const fstat = await stat(fpath);
      if (fstat.isFile()) {
        const formmatedFileName = file.startsWith("_")
          ? file.replace("_", ".")
          : file;
        const data = await readFile(fpath, { encoding: "utf-8" });
        await writeFile(join(newDir, formmatedFileName), data, {
          encoding: "utf-8",
        });
      }
      if (fstat.isDirectory()) {
        const subDir = join(newDir, file);
        await mkdir(subDir);
        composeFilesAndDir(fpath, subDir);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function scaffoldProject(pkgDir: string) {
  const userDir = join(__dirname, "new-app");
  // const userDir = resolveProjectDir(pkgDir); // final
  await mkdir(userDir);
  composeFilesAndDir(pkgDir, userDir);
}

(async () => {
  const projectDir = await getTmplDir();
  scaffoldProject(projectDir);
})();
