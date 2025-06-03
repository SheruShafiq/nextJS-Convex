import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import convexPlugin from "@convex-dev/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
   ...convexPlugin.configs.recommended,
  {
    languageOptions: {
      parser: await import("@typescript-eslint/parser"),
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname
      }
    }
  },
  {
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
];

export default eslintConfig;
