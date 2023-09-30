import { input, select, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { Options } from "../types/types.js";

async function CLI(): Promise<Options> {
  const projectName = await input({
    message: "What is the name of your project?",
    default: "my-smooth-app",
  });
  const type = await select<Options["type"]>({
    message: "What type of project are you builing?",
    choices: [
      {
        name: `${chalk.greenBright("Express")}`,
        value: "express",
      },
      {
        name: `${chalk.blue("NPM Package")}`,
        value: "npm",
      },
    ],
  });

  const format = await select<Options["format"]>({
    message: "Which module format do you want typescript to build to?",
    choices: [
      {
        name: "CommonJs",
        value: "cjs",
      },
      {
        name: "ES Modules",
        value: "esm",
      },
    ],
  });

  const installDeps = await confirm({
    message: "Do you want us to install the dependencies?",
  });

  let packageManager;

  if (installDeps) {
    packageManager = await select<Options["packageManager"]>({
      message: "Which package manager do you use?",
      choices: [
        {
          name: "npm",
          value: "npm",
        },
        {
          name: "pnpm",
          value: "pnpm",
        },
        {
          name: "yarn",
          value: "yarn",
        },
      ],
    });
  }

  return { projectName, type, format, installDeps, packageManager };
}
export { CLI };
