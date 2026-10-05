module.exports = {
  env: { browser: true, es2021: true, webextensions: true },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  settings: { react: { version: 'detect' } }
};
