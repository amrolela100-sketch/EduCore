import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The original codebase contains many inline quotes (Arabic/English text)
      // and setState-in-effect patterns. Disabling to focus on real issues.
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Build/output artifacts
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    ".eve/**",
    "storage/**",
    ".vscode/**",
    "scripts/**",
    "tests/**",
  ]),
]);

export default eslintConfig;
