// Ambient declaration for the Vite-style ?inline / ?raw CSS import suffix.
// The inline-css-loader esbuild plugin (see src/utils/esbuild/inline-css-loader.ts)
// resolves these imports at runtime to the file's raw text.
declare module '*.css?inline' {
  const content: string;
  export default content;
}
declare module '*.css?raw' {
  const content: string;
  export default content;
}
