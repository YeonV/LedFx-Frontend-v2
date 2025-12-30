import typescriptEslint from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
// import reactHooks from 'eslint-plugin-react-hooks'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: [
      '**/build/*',
      '**/dist/*',
      '**/*.js',
      '**/*.jsx',
      '**/*.mjs',
      '**/*.cjs',
      'extraResources/**'
    ]
  },
  ...compat.extends(
    'standard',
    'plugin:storybook/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ),
  {
    files: ['**/workers/**/*.ts'],
    linterOptions: {
      reportUnusedDisableDirectives: false
    }
  },
  {
    
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
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
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'prettier/prettier': prettier
      // 'react-hooks': reactHooks
    },
    rules: {
      // 'no-unused-directive': 'off',
      'react-hooks/set-state-in-effect': 'off',
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true,
          // Add this:
          "args": "after-used" // Only flag unused args AFTER they're used
        }
      ],
      'react-hooks/rules-of-hooks': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_'
        }
      ],
      quotes: [2, 'single'],
      'max-len': [
        'error',
        {
          code: 120,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true
        }
      ],
      'object-curly-newline': 'off',
      'comma-dangle': 'off',
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0,
      'import/no-amd': 0,
      'import/no-mutable-exports': 0,
      'import/newline-after-import': 0,
      'no-nested-ternary': 0,
      'import/extensions': 0,
      'import/first': 0,
      '@/indent': 'off',
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
      'jsx-a11y/label-has-associated-control': 0
    },
  }
]
