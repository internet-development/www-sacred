import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite library build for SRCL (Pattern B: subpath exports with preserved modules)
 *
 * This configuration:
 * - Builds ES modules and preserves the original file/module structure.
 * - Emits dist/components/* and dist/common/* so they can be addressed via subpath exports.
 * - Leaves React as an external peer dependency so consumers provide their own React.
 *
 * Usage:
 *   npm run build:lib
 *
 * Notes:
 * - We keep the same aliases as the app build so internal imports like "@components/..." resolve during the build.
 * - Rollup will output relative imports between emitted files. Declarations should be emitted separately via tsc.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@root': path.resolve(__dirname, './'),
      '@system': path.resolve(__dirname, './system'),
      '@demos': path.resolve(__dirname, './demos'),
      '@common': path.resolve(__dirname, './common'),
      '@data': path.resolve(__dirname, './data'),
      '@components': path.resolve(__dirname, './components'),
      '@lib': path.resolve(__dirname, './lib'),
      '@pages': path.resolve(__dirname, './pages'),
      '@modules': path.resolve(__dirname, './modules'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    target: 'esnext',
    lib: {
      // Single entry to expose the root export (.)
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        global: path.resolve(__dirname, 'src/global.ts'),
        'modules/hotkeys/index': path.resolve(
          __dirname,
          'modules/hotkeys/index.ts',
        ),
      },
      // Only ESM for optimal tree-shaking in consumers
      formats: ['es'],
      // When preserveModules is true, fileName is ignored for chunks, but harmless to keep.
      fileName: (format, entryName) => `${entryName}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Emit each module as its own file
        preserveModules: true,
        // Mirror the project structure under dist/
        // This keeps dist/components/* and dist/common/* intact for subpath exports
        preserveModulesRoot: '.',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        // Route the compiled global.css into dist/src for a stable export path,
        // keep all other assets under dist/assets
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          return name === 'global.css' ? 'src/[name][extname]' : 'assets/[name][extname]';
        },
      },
    },
  },
});
