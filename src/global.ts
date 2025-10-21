/**
 * Build entry for SRCL global styles.
 *
 * Importing this file ensures Vite emits a compiled CSS asset alongside the JS bundle.
 * In the library build, this will produce:
 *   - dist/src/global.css
 *
 * Consumers can then import styles with:
 *   import 'srcl/global.css'
 *
 * Note: This file intentionally has no runtime exports; it only triggers style emission.
 */
/// <reference types="vite/client" />

import '../global.scss';

// Ensure font assets referenced from the global stylesheet are copied into the
// library build output. The eager glob registers each file with Vite/Rollup so
// hashed assets are emitted even though we only reference them from CSS.
const fontAssets = import.meta.glob('./assets/fonts/**/*.{woff,woff2,ttf,otf,eot}', {
  import: 'default',
  eager: true,
});

void fontAssets;

// Mark as a module with no exports to satisfy isolatedModules
export {};
