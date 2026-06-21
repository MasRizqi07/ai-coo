const base = require('./base');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...base,
  {
    files: ['**/*.ts'],
    rules: {
      // NestJS uses decorators and classes extensively
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
];
