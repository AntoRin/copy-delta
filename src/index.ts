import path from "path";
import minimist, { ParsedArgs } from "minimist";
import { CopyDeltaHandler } from "./CopyDeltaHandler";
import { Options } from "./interfaces/Options";
import { displayHelp } from "./help";

const pkg: any = require("../package.json");

export function main(commandLineArgs: any[]) {
   try {
      const parsedArgs: ParsedArgs = minimist<Options>(commandLineArgs);

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

      const exclusions = parsedArgs.exclude || parsedArgs.e ? ((parsedArgs.exclude || parsedArgs.e) as string).split(",") : [];

      for (const srcPath of srcPaths) {
         const copyDeltaHandler: CopyDeltaHandler = new CopyDeltaHandler({ srcPath, destPath, verbose, exclusions });

         copyDeltaHandler.init();
      }
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
}
