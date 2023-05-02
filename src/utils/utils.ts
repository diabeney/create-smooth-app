import chalk from "chalk";

const logger = {
  success: (msg: string) => chalk.greenBright(msg),
  error: (msg: string) => chalk.redBright(msg),
  info: (msg: string) => chalk.blueBright(msg),
};

export { logger };
