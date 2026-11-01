import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  printWidth: 110,
  sortImports: true,
  sortTailwindcss: {
    stylesheet: './web-app/src/index.css',
  },
  ignorePatterns: ['pnpm-lock.yaml'],
});
