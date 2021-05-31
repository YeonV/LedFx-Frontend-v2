module.exports = {
  extends: ["airbnb", "plugin:@typescript-eslint/recommended"],
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
    "react/jsx-filename-extension": [2, { extensions: [".ts", ".tsx"] }],
    "import/no-extraneous-dependencies": [
      2,
      { devDependencies: ["**/test.tsx", "**/test.ts"] },
    ],
    "@typescript-eslint/indent": [2, 2],
    "react/react-in-jsx-scope": "off",
  },
};
