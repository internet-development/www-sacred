//NOTE(jimmylee): Vitest configuration for sacred — restricts test discovery to the sacred CLI
//NOTE(jimmylee): library, the React component catalog sync guard under components/__tests__, and the
//NOTE(jimmylee): /llm/* URL guard under app/llm/__tests__. Excludes .workdir which lives alongside
//NOTE(jimmylee): for porting reference but ships its own (much larger) test suite.

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
