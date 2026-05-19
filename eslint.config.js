// SupaCode ESLint flat config
//
// Ban list rationale (SUP-SSR-006):
//   - "server-only" import: Next.js drift prevention; agents trained on
//     Next sometimes try to add it. Not valid in TanStack Start.
//   - `node:fs`, `node:path` in route components: SSR-safe agent guard.
//   - Edits to `*.gen.ts`: routeTree.gen.ts is regenerated; any change
//     gets silently overwritten. Guard at lint layer, not just agent.

import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "dist/**",
      ".wrangler/**",
      "node_modules/**",
      "src/routeTree.gen.ts",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        globalThis: "readonly",
        URL: "readonly",
        Request: "readonly",
        Response: "readonly",
        fetch: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "`server-only` is a Next.js convention; not applicable in TanStack Start. Move server logic into a server-side handler or createServerFn.",
            },
          ],
          patterns: [
            {
              group: ["node:fs", "node:path", "fs", "path"],
              message:
                "Direct Node fs/path is unavailable in route components. Use a server function or move logic into src/server.ts.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.gen.ts"],
    rules: {
      // No human edits to generated files. The build will overwrite.
      "no-restricted-syntax": [
        "error",
        {
          selector: "*",
          message:
            "Do not edit *.gen.ts files. TanStack Router regenerates them on every save.",
        },
      ],
    },
  },
];
