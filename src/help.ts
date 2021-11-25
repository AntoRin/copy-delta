import chalk from "chalk";

export function displayHelp() {
   const helpString = `${chalk.blue("Usage:")}\n${chalk.yellowBright(
      "copyd (<src_path>... | --src=src_path | -s src_path) (--dest=dest_path | -d dest_path | dest_path)"
   )}\n\n${chalk.greenBright("Note: You can use 'copydelta' instead of 'copyd'")}`;

   console.log(helpString);
}
