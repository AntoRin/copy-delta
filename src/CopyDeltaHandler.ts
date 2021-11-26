import path from "path";
import { statSync, readdirSync, existsSync } from "fs";
import copy from "recursive-copy";
import { Options } from "./interfaces/Options";
import chalk from "chalk";

export class CopyDeltaHandler {
   private _config: Options;

   constructor({ verbose, exclusions, dryRun }: Options) {
      this._config = {
         dryRun: !!dryRun,
         verbose: !!dryRun ? true : !!verbose,
         exclusions: exclusions || [],
      };
   }

   init(srcPath: string, destPath: string): void {
      try {
         if (!srcPath || !destPath) {
            throw new Error("Required src and dest paths");
         }
         this.copyDelta(srcPath, destPath);
      } catch (error) {
         console.log(error);
         process.exit(1);
      }
   }

   async copyR(src: string, dest: string): Promise<void> {
      if (!this._config.dryRun) await copy(src, dest);

      if (this._config.verbose) console.log(`${chalk.blue(src)} ${chalk.cyanBright("->")} ${chalk.green(dest)}`);
   }

   async copyDelta(currentSrcPath: string, currentDestPath: string): Promise<void> {
      try {
         const isExcludedPath =
            this._config.exclusions.includes(path.basename(currentSrcPath)) ||
            this._config.exclusions.includes(path.extname(path.basename(currentSrcPath)));

         if (isExcludedPath) return;

         let directoryContents: string[] = [];

         const pathStat = statSync(currentSrcPath);

         if (!pathStat.isDirectory()) {
            directoryContents.push(currentSrcPath);
         } else {
            directoryContents = readdirSync(currentSrcPath);
         }

         for (const item of directoryContents) {
            const srcItemPath = path.join(currentSrcPath, item);
            const destItemPath = path.join(currentDestPath, item);

            if (!existsSync(srcItemPath)) continue;

            const isExcludedItem = this._config.exclusions.includes(item) || this._config.exclusions.includes(path.extname(item));

            if (!existsSync(destItemPath) && !isExcludedItem) {
               await this.copyR(srcItemPath, destItemPath);
            } else {
               await this.copyDelta(srcItemPath, destItemPath);
            }
         }
      } catch (error) {
         console.log("error", error);
         process.exit(1);
      }
   }
}
