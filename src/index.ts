import path from "path";
import minimist, { ParsedArgs } from "minimist";
import { CopyDeltaHandler } from "./CopyDelta";
import { Options } from "./interfaces/Options";

const pkg: any = require("../package.json");

export function main(commandLineArgs: any[]) {
   try {
      const parsedArgs: ParsedArgs = minimist<Options>(commandLineArgs);

      if (parsedArgs.help || parsedArgs.h) {
         return console.log("Copy delta between two directories");
      }

      if (parsedArgs.version || parsedArgs.v) {
         return console.log(pkg.version);
      }

      const processOptions: Options = {
         srcPath: path.resolve(parsedArgs.src || parsedArgs.s),
         destPath: path.resolve(parsedArgs.dest || parsedArgs.d),
         verbose: parsedArgs.verbose || parsedArgs.V,
         exclusions: parsedArgs.exclude || parsedArgs.e ? ((parsedArgs.exclude || parsedArgs.e) as string).split(",") : [],
      };

      const copyDeltaHandler: CopyDeltaHandler = new CopyDeltaHandler(processOptions);

      copyDeltaHandler.init();
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
}
