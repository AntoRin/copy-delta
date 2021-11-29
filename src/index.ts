import path from "path";
import minimist, { ParsedArgs } from "minimist";
import { CopyDeltaHandler } from "./CopyDeltaHandler";
import { displayHelp } from "./help";

const pkg: any = require("../package.json");

export function main(commandLineArgs: string[]) {
   try {
      const parsedArgs: ParsedArgs = minimist(commandLineArgs, {
         boolean: ["dry-run", "verbose", "version", "help"],
         alias: {
            v: "version",
            V: "verbose",
            D: "dry-run",
            h: "help",
            s: "src",
            d: "dest",
            e: "exclude",
         },
      });

      if (parsedArgs.help) {
         return displayHelp();
      }

      if (parsedArgs.version) {
         return console.log(pkg.version);
      }

      const params = [...parsedArgs._];

      const destPath = path.resolve(parsedArgs.dest || params.splice(-1)[0]);

      const srcPaths = [...params.map((p: string) => path.resolve(p)), ...(parsedArgs.src ? [path.resolve(parsedArgs.src)] : [])];

      const verbose = parsedArgs.verbose;

      const dryRun = parsedArgs["dry-run"];

      const exclusions = parsedArgs.exclude ? (parsedArgs.exclude as string).split(",") : [];

      const copyDeltaHandler: CopyDeltaHandler = new CopyDeltaHandler({ verbose, exclusions, dryRun });

      for (const srcPath of srcPaths) {
         copyDeltaHandler.init(srcPath, destPath);
      }
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
}
