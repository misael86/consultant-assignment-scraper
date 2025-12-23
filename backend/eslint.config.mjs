import { defineConfig } from "eslint/config";
import { baseConfig } from "../eslint.config.mjs";
import globals from "globals";

export default defineConfig([
  ...baseConfig,
  {
    // Backend specific overrides
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
       "no-console": "off" 
    }
  }
]);
