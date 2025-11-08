import markdown from "@eslint/markdown";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import jsonc from "eslint-plugin-jsonc";
// import jsxA11y from "eslint-plugin-jsx-a11y";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import security from "eslint-plugin-security";
import sonarJs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig(
  ...nextVitals,
  ...nextTs,

  // Ignore folders that are generated or contain dependencies
  {
    ignores: ["node_modules", "dist", "public", "**/vite-env.d.ts"],
  },

  // Files that are run on the browser
  // Enable type-aware linting for TypeScript file with the projectSeervice option
  {
    extends: [
      // eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      perfectionist.configs["recommended-natural"],
      unicorn.configs.recommended,
      security.configs.recommended,
      sonarJs.configs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: { project: "./tsconfig.json", projectService: true },
    },
    plugins: { "no-relative-import-paths": noRelativeImportPaths },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: true, prefix: "", rootDir: "app" },
      ],
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
    },
  },

  // Add plugins that are only relevant to React files
  {
    extends: [
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.recommended,
      // jsxA11y.flatConfigs.recommended,
    ],
    files: ["**/*.tsx"],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },

  // Playwright test files
  {
    extends: [playwright.configs["flat/recommended"]],
    files: ["tests/**/*.ts"],
  },

  // Files that are run on Node.js
  {
    files: ["**/vite.config.ts", "tests/**/*.ts"],
    languageOptions: { globals: globals.node },
  },

  // JSON files
  {
    extends: [jsonc.configs["flat/recommended-with-jsonc"], jsonc.configs["flat/prettier"]],
    files: ["**/*.json"],
    ignores: ["package-lock.json"],
    rules: { "jsonc/sort-keys": "warn" },
  },

  // Markdown files
  {
    extends: [markdown.configs.recommended],
    files: ["**/*.md"],
    plugins: {
      markdown: markdown,
    },
    rules: {
      "markdown/no-html": "error",
    },
  },

  // Remove linting rules that conflict with Prettier
  // Needs to be the last config applied
  prettier,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ])
);
