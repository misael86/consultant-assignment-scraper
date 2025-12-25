import markdown from "@eslint/markdown";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import jsonc from "eslint-plugin-jsonc";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import security from "eslint-plugin-security";
import sonarJs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

const ignoreConfig = {
  ignores: ["node_modules", "dist", "public", "**/vite-env.d.ts", ".next/**", "out/**", "build/**"],
};

export const baseConfig = [
  ignoreConfig,
  // Files that are run on the browser
  // Enable type-aware linting for TypeScript file with the projectService option
  {
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      perfectionist.configs["recommended-natural"],
      unicorn.configs.recommended,
      security.configs.recommended,
      sonarJs.configs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser, // Can be overridden
      parser: tsParser,
      parserOptions: { projectService: true },
    },
    plugins: { "no-relative-import-paths": noRelativeImportPaths },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: true, prefix: "", rootDir: "src" },
      ],
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
    },
  },

  // Playwright test files
  {
    extends: [playwright.configs["flat/recommended"]],
    files: ["tests/**/*.ts"],
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

  // Needs to be last
  prettier,
];
