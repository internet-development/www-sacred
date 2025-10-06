import { defineConfig } from "tsdown";
import styles from "rollup-plugin-styles";

export default defineConfig([
  {
    entry: ["./src/**/index.ts", "./src/modules/**/*.ts"],
    platform: "neutral",
    format: ["esm", "cjs"],
    dts: true,
    target: "esnext",
    exports: {
      customExports(pkg, context) {
        const newPkg = {};
        // This makes it so anything in the /components folder have a top level import.
        for (const key in pkg) {
          if (key.includes("/components")) {
            const newKey = key.replace("/components", "");
            newPkg[newKey] = pkg[key];
          } else {
            newPkg[key] = pkg[key];
          }
        }
        return newPkg;
      },
    },
    outDir: "dist",
    plugins: [styles({ modules: true })],
  },
]);
