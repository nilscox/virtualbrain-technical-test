import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc', 'react'],
  categories: {
    correctness: 'error',
  },
  options: {
    typeAware: true,
  },
  rules: {
    'typescript/no-explicit-any': 'error',
  },
  overrides: [
    {
      files: ['web-app/**/*.{ts,tsx}'],
      plugins: ['react'],
      rules: {
        'react/rules-of-hooks': 'error',
        'react/exhaustive-deps': 'warn',
        'react/only-export-components': ['warn', { allowConstantExport: true }],
      },
    },
  ],
  ignorePatterns: ['**/dist'],
});
