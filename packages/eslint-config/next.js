const base = require('./base');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Next.js Server Actions can use 'use server' directive
    },
  },
];
