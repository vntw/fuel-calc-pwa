module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['preact', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist/'],
  settings: {
    jest: {
      version: 27,
    },
  },
};
