import { defineConfig } from "eslint/config";
import { baseConfig, frontendConfig } from "../eslint.config.mjs";

export default defineConfig([
  ...baseConfig,
  ...frontendConfig,
]);
