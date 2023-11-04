import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Options } from "../types/types.js";
import chalk from "chalk";
import { spawnSync } from "child_process";
const logger = {
  success: (msg: string) => chalk.greenBright(msg),
  error: (msg: string) => chalk.redBright(msg),
  info: (msg: string) => chalk.blueBright(msg),
};

function validatePackageName(pkgName: string) {
  const validPackageName = /^[a-zA-Z0-9-_.]+$/g;
  return validPackageName.test(pkgName);
}

function resolveProjectDir(name: string) {
  if (!validatePackageName(name)) throw new Error("Invalid package name");
  const cwd = process.cwd();
  if (name === ".") return cwd;
  return join(cwd, name);
}

function openJSONSync(configName: string, configDir: string) {
  const content = readFileSync(configDir, "utf8");
  const jsonData = JSON.parse(content);
  writeFileSync(configName, JSON.stringify(jsonData, null, 2));
}

function buildTsupConfig(rootDir: string, format: Options["format"]) {
  const configContent = ` import type { Options } from 'tsup'
    export default defineConfig({
    entry: ["src/index.ts"],
    splitting: false,
    clean: true,
    publicDir: "public",
    format: ["${format}"],
    skipNodeModulesBundle: true,
    target: "esnext",
    minifySyntax: true,
});
  `;
  const buf = Buffer.from(configContent, "utf-8");
  writeFileSync(join(rootDir, "tsup.config.ts"), buf, "utf-8");
}

function installPackages(packageManager: Options["packageManager"]) {
  const installCommand = packageManager === "yarn" ? "yarn" : packageManager;
  console.log(logger.info("Installing dependencies. Please wait..."));

  const installProcess = spawnSync(installCommand || "npm", ["install"], {
    stdio: "inherit",
    shell: true,
  });

  if (installProcess.error) {
    console.error("Failed to install dependencies:", installProcess.error);
    process.exit(1);
  } else if (installProcess.status !== 0) {
    console.error(
      "Failed to install dependencies. Exit code:",
      installProcess.status
    );
    process.exit(1);
  }

  console.log(logger.success("Dependencies installed successfully!"));
}

export {
  resolveProjectDir,
  validatePackageName,
  buildTsupConfig,
  openJSONSync,
  logger,
  installPackages,
};
