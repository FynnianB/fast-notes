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
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "warn",
        {
          "name": "react-redux",
          "importNames": ["useSelector", "useDispatch"],
          "message": "Use typed hooks `useAppDispatch` and `useAppSelector` instead."
        }
      ],
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
          pattern: ["renderer/common/**/*", "renderer/store.ts"]
        },
        {
          mode: "full",
          type: "module",
          capture: ["moduleName", "_", "fileName"],
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
          type: "view",
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
              // allow shared to be imported from everywhere
              from: ["shared", "view", "entrypoint", "module"],
              allow: ["shared"]
            },
            {
              // allow imports from the same module
              from: ["module"],
              allow: [
                ["module", { "moduleName": "${from.moduleName}" }]
              ]
            },
            {
              // only allow views from entrypoints
              from: ["entrypoint"],
              allow: ["view"]
            },
            {
              // allow views to import views and modules
              from: ["view"],
              allow: ["view", "module"]
            }
          ]
        }
      ]
    }
  }
];