/* Global type declarations for SCSS modules and global SCSS imports */

/* SCSS Modules (*.module.scss / *.module.sass) return a mapping of class names */
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

/* Global SCSS/SASS imports (e.g., import '@root/global.scss') resolve to a string */
declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.sass' {
  const content: string;
  export default content;
}
