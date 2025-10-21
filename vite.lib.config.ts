import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path from 'path';

const fontExtensions = new Set(['.woff', '.woff2', '.ttf', '.otf', '.eot']);

async function injectCssImports(outputDir: string) {
  const modulesDir = path.join(outputDir, 'components');

  let entries;
  try {
    entries = await fs.readdir(modulesDir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return;
    }
    throw error;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.module.scss.js')) {
      continue;
    }

    const modulePath = path.join(modulesDir, entry.name);
    const cssFilePath = path.join(
      outputDir,
      'assets',
      'components',
      entry.name.replace('.module.scss.js', '.css'),
    );

    try {
      await fs.access(cssFilePath);
    } catch {
      continue;
    }

    const relativeImport = path
      .relative(path.dirname(modulePath), cssFilePath)
      .replace(/\\/g, '/');

    let code = await fs.readFile(modulePath, 'utf8');
    if (!code.includes(`"${relativeImport}"`) && !code.includes(`'${relativeImport}'`)) {
      code = `import "${relativeImport}";\n${code}`;
      await fs.writeFile(modulePath, code, 'utf8');
    }
  }
}

async function copyFontsRecursive(sourceDir: string, targetDir: string) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  await fs.mkdir(targetDir, { recursive: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyFontsRecursive(sourcePath, targetPath);
    } else if (fontExtensions.has(path.extname(entry.name).toLowerCase())) {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

const copyFontAssetsPlugin = () => ({
  name: 'copy-font-assets',
  async closeBundle() {
    const sourceDir = path.resolve(__dirname, 'src/assets/fonts');
    const targetDir = path.resolve(__dirname, 'dist/assets/fonts');

    try {
      await copyFontsRecursive(sourceDir, targetDir);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    await injectCssImports(path.resolve(__dirname, 'dist'));
  },
});

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
  plugins: [react(), copyFontAssetsPlugin()],
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

          if (name === 'global.css') {
            return 'src/[name][extname]';
          }

          const parsed = path.parse(name);
          const isModuleCss = parsed.ext === '.css' && parsed.name.endsWith('.module');
          const dir = parsed.dir ? `${parsed.dir}/` : '';
          const baseName = isModuleCss ? parsed.name.replace(/\.module$/, '') : parsed.name;

          return `assets/${dir}${baseName}${parsed.ext}`;
        },
      },
    },
  },
});
