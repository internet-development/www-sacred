import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const fontExtensions = new Set(['.woff', '.woff2', '.ttf', '.otf', '.eot']);
const fontUrlPattern = /url\((?:'|\")?(?:\.\.\/|\.\/src\/)assets\/fonts\/([^'\")]+)(?:'|\")?\)/g;

async function injectCssImports(outputDir: string) {
  const modulesDir = path.join(outputDir, 'components');

  async function walk(currentDir: string) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return;
      }
      throw error;
    }

    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith('.module.scss.js')) {
        continue;
      }

      const relativeModulePath = path
        .relative(modulesDir, entryPath)
        .replace(/\\/g, '/');
      const cssFilePath = path.join(
        outputDir,
        'assets',
        'components',
        relativeModulePath.replace('.module.scss.js', '.css'),
      );

      try {
        await fs.access(cssFilePath);
      } catch {
        continue;
      }

      const relativeImport = path
        .relative(path.dirname(entryPath), cssFilePath)
        .replace(/\\/g, '/');

      let code = await fs.readFile(entryPath, 'utf8');
      if (!code.includes(`"${relativeImport}"`) && !code.includes(`'${relativeImport}'`)) {
        code = `import "${relativeImport}";\n${code}`;
        await fs.writeFile(entryPath, code, 'utf8');
      }
    }
  }

  await walk(modulesDir);
}

async function collectReferencedFonts(): Promise<Set<string>> {
  const filesToScan = [path.resolve(__dirname, 'global.scss')];
  const referenced = new Set<string>();

  for (const filePath of filesToScan) {
    let content: string;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        continue;
      }
      throw error;
    }

    let match: RegExpExecArray | null;
    while ((match = fontUrlPattern.exec(content)) !== null) {
      const relativeFontPath = match[1].replace(/\\/g, '/');
      referenced.add(`fonts/${relativeFontPath}`);
    }
  }

  return referenced;
}

async function copyFontsWithHash(
  sourceDir: string,
  targetDir: string,
  referencedFonts: Set<string>,
) {
  const manifest = new Map<string, string>();

  const walk = async (currentDir: string) => {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return;
      }
      throw error;
    }

    for (const entry of entries) {
      const sourcePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(sourcePath);
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (!fontExtensions.has(extension)) {
        continue;
      }

      const fileBuffer = await fs.readFile(sourcePath);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex').slice(0, 8);
      const relativePath = path.relative(sourceDir, sourcePath);
      const relativeDir = path.dirname(relativePath);
      const targetSubDir = path.join(targetDir, relativeDir);

      const parsed = path.parse(entry.name);
      const posixDir = relativeDir === '.' ? '' : `${relativeDir.split(path.sep).join('/')}/`;
      const manifestKey = `fonts/${posixDir}${parsed.base}`;
      if (!referencedFonts.has(manifestKey)) {
        continue;
      }

      const hashedName = `${parsed.name}-${hash}${parsed.ext}`;

      await fs.mkdir(targetSubDir, { recursive: true });

      const targetPath = path.join(targetSubDir, hashedName);
      await fs.writeFile(targetPath, fileBuffer);

      manifest.set(manifestKey, `fonts/${posixDir}${hashedName}`);
    }
  };

  await walk(sourceDir);

  return manifest;
}

const copyFontAssetsPlugin = () => ({
  name: 'copy-font-assets',
  async closeBundle() {
    const sourceDir = path.resolve(__dirname, 'src/assets/fonts');
    const targetDir = path.resolve(__dirname, 'dist/assets/fonts');
    const cssPath = path.resolve(__dirname, 'dist/src/global.css');
    const referencedFonts = await collectReferencedFonts();

    const manifest = await copyFontsWithHash(sourceDir, targetDir, referencedFonts);

    if (manifest.size > 0) {
      try {
        let css = await fs.readFile(cssPath, 'utf8');

        for (const [original, hashed] of manifest) {
          const replacements = [
            { from: `../assets/${original}`, to: `../assets/${hashed}` },
            { from: `./src/assets/${original}`, to: `../assets/${hashed}` },
          ];

          for (const { from, to } of replacements) {
            if (css.includes(from)) {
              css = css.split(from).join(to);
            }
          }
        }

        await fs.writeFile(cssPath, css, 'utf8');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
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
          const normalizedDir = parsed.dir ? parsed.dir.split(path.sep).join('/') : '';
          const dir = normalizedDir ? `${normalizedDir}/` : '';
          const isModuleCss = parsed.ext === '.css' && parsed.name.endsWith('.module');

          if (isModuleCss) {
            const baseName = parsed.name.replace(/\.module$/, '');
            return `assets/${dir}${baseName}${parsed.ext}`;
          }

          if (fontExtensions.has(parsed.ext.toLowerCase())) {
            return `assets/${dir}${parsed.name}-[hash]${parsed.ext}`;
          }

          return `assets/${dir}${parsed.name}-[hash]${parsed.ext}`;
        },
      },
    },
  },
});
