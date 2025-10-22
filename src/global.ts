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

// Mark as a module with no exports to satisfy isolatedModules
export {};
