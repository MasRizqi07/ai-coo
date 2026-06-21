const tseslint = require('typescript-eslint');

/** @type {import('eslint').Linter.Config[]} */
module.exports = tseslint.config(
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommended,
    ],
    rules: {
      // Spec §16: No `any` as escape hatch
      '@typescript-eslint/no-explicit-any': 'error',

      // Spec §16: No console.log in production
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Prefer const
      'prefer-const': 'error',

      // No unused vars (allow underscore prefix)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Relaxed rules for test files
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.e2e-spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
);
