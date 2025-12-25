import { defineConfig } from "eslint/config";
import { baseConfig } from "../eslint.config.mjs";
import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...baseConfig,

  // Add plugins that are only relevant to React files
  {
    extends: [react.configs.flat.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.recommended],
    files: ["**/*.tsx"],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
