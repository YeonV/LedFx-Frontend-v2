module.exports = {
  extends: ["airbnb", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {},
    },
  },
  ignorePatterns: ["**/build/*", "*.js", "*.jsx"],
  rules: {
    quotes: [2, "single"],
    'prettier/prettier': ['error', { singleQuote: true }],
    "react/jsx-filename-extension": [2, { extensions: [".ts", ".tsx"] }],
    "import/no-extraneous-dependencies": [
      2,
      { devDependencies: ["**/test.tsx", "**/test.ts"] },
    ],
    "no-nested-ternary": 0,
    "import/extensions": 0,
    "@typescript-eslint/indent": [2, 2],
    "react/react-in-jsx-scope": "off",
    "react/function-component-definition": [0],
    "react/jsx-props-no-spreading": 0,
    "camelcase": 0,
    "react/no-array-index-key": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "jsx-a11y/label-has-associated-control": 0,
  },
};
