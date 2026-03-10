const { builtinRules } = require("eslint/use-at-your-own-risk");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

const recommendedRules = Object.fromEntries(
  Array.from(builtinRules.entries())
    .filter(([, rule]) => rule?.meta?.docs?.recommended)
    .map(([ruleName]) => [ruleName, "error"]),
);

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        console: "readonly",
        fetch: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...recommendedRules,
      ...prettierConfig.rules,
      "prettier/prettier": "warn",
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
