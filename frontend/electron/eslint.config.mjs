import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import importPlugin from 'eslint-plugin-import';
import boundaries from "eslint-plugin-boundaries";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.electron,
  importPlugin.flatConfigs.typescript,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: {
        version: "^18.3.1",
      },
      "import/resolver": {
        alias: {
          map: [
            ["@common", "./renderer/common"],
            ["@modules", "./renderer/modules"],
            ["@views", "./renderer/views"],
          ],
        },
        node: true,
        typescript: true
      }
    },
  },
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/include": ["renderer/**/*"],
      "boundaries/elements": [
        {
          mode: "full",
          type: "shared",
          pattern: ["renderer/common/**/*"]
        },
        {
          mode: "full",
          type: "module",
          capture: ["moduleName"],
          pattern: ["renderer/modules/*/**/*"]
        },
        {
          mode: "full",
          type: "entrypoint",
          capture: ["_", "fileName"],
          pattern: ["renderer/application-entrypoints/**/*"]
        },
        {
          mode: "full",
          type: "app",
          capture: ["_", "fileName"],
          pattern: ["renderer/views/**/*"]
        },
        {
          mode: "full",
          type: "neverImport",
          pattern: ["renderer/*"]
        }
      ]
    },
    rules: {
      "boundaries/no-unknown": ["error"],
      "boundaries/no-unknown-files": ["error"],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: ["shared"],
              allow: ["shared"]
            },
            {
              from: ["module"],
              allow: [
                "shared",
                ["module", { "moduleName": "${from.moduleName}" }]
              ]
            },
            {
              from: ["app", "entrypoint", "neverImport"],
              allow: ["shared", "module"]
            },
            {
              from: ["app", "entrypoint"],
              allow: ["app"]
            }
          ]
        }
      ]
    }
  }
];