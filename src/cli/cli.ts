import { input, select, confirm } from "@inquirer/prompts";
import { logger } from "../utils/utils";
import chalk from "chalk";

(async () => {
  const name = await input({
    message: "What is the name of your project?",
    default: "my-smooth-app",
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
    message: "Which language do you want to use",
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
  if (language === "JavaScript") {
    logger.error(`No you should use ${chalk.blueBright("Typescipt")}`);
    language = "Typescript";
  }

  if (language === "TypeScript") {
    logger.success("You made the right choice!!");
  }

  let configs;
  if (type === "npm") {
    configs = {
      npm: {
        moduleFormat: await select({
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

  const answers = {
    name: name,
    type: type,
    language: language,
    configs: configs,
    installPackages: installPackages,
  };

  console.log(answers);
})();

export {};
