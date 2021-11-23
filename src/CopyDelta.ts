import path from "path";
import { statSync, readdirSync, existsSync } from "fs";
import copy from "recursive-copy";
import { Options } from "./interfaces/Options";

export class CopyDeltaHandler {
   public srcPath: string;
   public destPath: string;
   public verbose: boolean;
   public exclusions: string[];

   constructor({ srcPath, destPath, verbose, exclusions }: Options) {
      this.srcPath = srcPath;
      this.destPath = destPath;
      this.verbose = verbose || true;
      this.exclusions = exclusions || [];
   }

   init(): void {
      try {
         if (!this.srcPath || !this.destPath) {
            throw new Error("Required src and dest paths");
         }
         this.copyDelta(this.srcPath, this.destPath);
      } catch (error) {
         console.log(error);
         process.exit(1);
      }
   }

   async copyR(src: string, dest: string): Promise<void> {
      await copy(src, dest);
      if (this.verbose) console.log(`From ${src} to ${dest}`);
   }

   async copyDelta(currentSrcPath: string, currentDestPath: string): Promise<void> {
      let directoryContents: string[] = [];

      const pathStat = statSync(currentSrcPath);

      if (!pathStat.isDirectory()) {
         directoryContents.push(currentSrcPath);
      } else {
         directoryContents = readdirSync(currentSrcPath);
      }

      for (const item of directoryContents) {
         try {
            const srcItemPath = path.join(currentSrcPath, item);
            const destItemPath = path.join(currentDestPath, item);

            if (!existsSync(srcItemPath)) continue;

            const isExcluded = this.exclusions.includes(item) || this.exclusions.includes(path.extname(item));

            if (!existsSync(destItemPath) && !isExcluded) {
               await this.copyR(srcItemPath, destItemPath);
            } else {
               await this.copyDelta(srcItemPath, destItemPath);
            }
         } catch (error) {
            console.log("error", error);
            process.exit(1);
         }
      }
   }
}
