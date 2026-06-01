import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'scripts/cli/lib/__tests__/**/*.test.mjs',
      'components/__tests__/**/*.test.mjs',
      'app/llm/__tests__/**/*.test.mjs',
    ],
    exclude: ['node_modules/**', '.workdir/**', '.next/**'],
  },
});
