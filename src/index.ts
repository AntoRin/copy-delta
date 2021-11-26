import path from "path";
import minimist, { ParsedArgs } from "minimist";
import { CopyDeltaHandler } from "./CopyDeltaHandler";
import { displayHelp } from "./help";

const pkg: any = require("../package.json");

export function main(commandLineArgs: any[]) {
   try {
      const parsedArgs: ParsedArgs = minimist(commandLineArgs);

      if (parsedArgs.help || parsedArgs.h) {
         return displayHelp();
      }

      if (parsedArgs.version || parsedArgs.v) {
         return console.log(pkg.version);
      }

      const params = [...parsedArgs._];

      const destPath = path.resolve(parsedArgs.d || parsedArgs.dest || params.splice(-1)[0]);

      const srcPaths = [
         ...params.map((p: string) => path.resolve(p)),
         ...(parsedArgs.src || parsedArgs.s ? [path.resolve(parsedArgs.src || parsedArgs.s)] : []),
      ];

      const verbose = parsedArgs.verbose || parsedArgs.V;

      const dryRun = parsedArgs["dry-run"] || parsedArgs.D;

      const exclusions = parsedArgs.exclude || parsedArgs.e ? ((parsedArgs.exclude || parsedArgs.e) as string).split(",") : [];

      const copyDeltaHandler: CopyDeltaHandler = new CopyDeltaHandler({ verbose, exclusions, dryRun });

      for (const srcPath of srcPaths) {
         copyDeltaHandler.init(srcPath, destPath);
      }
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
}
