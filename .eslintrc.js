module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2019
  },
  plugins: ["prettier", "@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    'plugin:prettier/recommended',
    "prettier/@typescript-eslint"
  ]
};
