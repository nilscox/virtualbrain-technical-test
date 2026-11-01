import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  printWidth: 110,
  sortImports: true,
  sortTailwindcss: {
    config: './web-app/tailwind.config.js',
  },
  ignorePatterns: ['pnpm-lock.yaml'],
});
