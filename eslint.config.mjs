/* eslint-disable no-underscore-dangle */
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: ['**/build/*', '**/*.js', '**/*.jsx', 'extraResources/**']
  },
  ...compat.extends(
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier
    },

    languageOptions: {
      parser: tsParser
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },

      'import/resolver': {
        typescript: {},

        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },

      'typescript.format.semicolons': 'remove',
      'javascriptscript.format.semicolons': 'remove'
    },

    rules: {
      quotes: [2, 'single'],
      'max-len': [
        'error',
        {
          code: 900,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true
        }
      ],
      'object-curly-newline': 'off',
      'comma-dangle': 'off',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ],

      'react/jsx-filename-extension': [
        2,
        {
          extensions: ['.ts', '.tsx']
        }
      ],

      // 'import/no-extraneous-dependencies': [
      //   2,
      //   {
      //     devDependencies: ['**/test.tsx', '**/test.ts']
      //   }
      // ],
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0,
      'import/no-amd': 0,
      'import/no-mutable-exports': 0,
      'import/newline-after-import': 0,
      'no-nested-ternary': 0,
      'import/extensions': 0,
      'import/first': 0,
      '@typescript-eslint/indent': [2, 2],
      'react/react-in-jsx-scope': 'off',
      'react/function-component-definition': [0],
      'react/jsx-props-no-spreading': 0,
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'no-plusplus': 0,
      semi: ['error', 'never'],
      camelcase: 0,
      'react/no-array-index-key': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@prettier/trailing-comma': 0,
      'no-unused-vars': 0,
      // "no-unused-vars": ["error", {
      //     argsIgnorePattern: "^_",
      // }],

      '@typescript-eslint/no-unused-vars': 0,
      // "@typescript-eslint/no-unused-vars": ["error", {
      //     argsIgnorePattern: "^_",
      // }],
      'jsx-a11y/label-has-associated-control': 0
    }
  }
]
