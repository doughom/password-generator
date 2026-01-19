import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export default function createPlainVersion() {
  let config;

  return {
    name: "create-plain-version",

    configResolved(conf) {
      config = conf;
    },

    writeBundle() {
      const destDir = join(config.root, config.build.outDir);

      cpSync(config.root, destDir, {
        recursive: true,
        filter: (src) => {
          return src.endsWith("index.html") ? false : true;
        },
      });

      cpSync(join(config.root, "index.html"), join(destDir, "plain.html"));

      // Skip Bootstrap import.
      let filePath = join(destDir, "view.js");
      let text = readFileSync(filePath, "utf-8");
      const importPattern = new RegExp(/\nimport.*/g);
      text = text.replace(importPattern, "");
      writeFileSync(filePath, text);

      // Fix navbar link.
      filePath = join(destDir, "plain.html");
      text = readFileSync(filePath, "utf-8");
      text = text.replace("plain.html", "index.html");
      text = text.replace("Plain", "Bootstrap");
      writeFileSync(filePath, text);
    },
  };
}
