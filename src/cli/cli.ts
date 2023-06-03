import { input, select, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { logger, validPackageName } from "../utils/utils";

async function getAnswers() {
  const name = await input({
    message: "What is the name of your project?",
    default: "my-smooth-app",
    validate: validPackageName,
  });
  const type = await select({
    message: "What type of project are you builing?",
    choices: [
      {
        name: "NPM",
        value: "npm",
      },
      {
        name: `${chalk.blue("React")}`,
        value: "react",
      },
    ],
  });
  let language = await select({
    message: "Which language do you want to use?",
    choices: [
      {
        name: `${chalk.yellow("JavaScript")}`,
        value: "JavaScript",
      },
      {
        name: `${chalk.blue("TypeScript")}`,
        value: "TypeScript",
      },
    ],
  });

  {
    if (language === "JavaScript") {
      language = "TypeScript";
      logger.info("No way!, you must use TypeScript");
    } else {
      logger.success("Yay!! you made the right choice!");
    }
  }

  let configs;
  if (type === "npm") {
    configs = {
      npm: {
        nodeModuleFormat: await select({
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
            {
              name: "Both",
              value: "both",
            },
          ],
        }),
      },
    };
  }
  const installPackages = await confirm({
    message: "Do you want us to install dependencies?",
  });

  let pkg_manager;

  if (installPackages) {
    pkg_manager = await select({
      message: "Which package manager do you use?",
      choices: [
        {
          name: `npm`,
          value: "npm",
        },
        {
          name: `yarn`,
          value: "yarn",
        },
        {
          name: `pnpm`,
          value: "pnpm",
        },
      ],
    });
  }

  const answers = {
    name: name,
    type: type,
    language: language,
    configs: configs,
    installPackages: installPackages,
    packageManager: pkg_manager,
  };

  return answers;
}
let CLI;
if (process.stdout.isTTY) {
  CLI = {
    Run: getAnswers,
  };
} else {
  logger.error("Your terminal is not interactive!");
}

export { CLI };
