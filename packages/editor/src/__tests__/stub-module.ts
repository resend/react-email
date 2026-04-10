/**
 * Stub for `react-email` in the Vite browser test environment.
 * Render and markdown depend on Node-only modules (`prettier`,
 * `md-to-react-email`) that Vite cannot resolve in the browser.
 * Component stubs satisfy the named exports used by editor extensions.
 */

// render exports
export const plainTextSelectors = {};
export const pretty = async (html: string) => html;
export const render = async () => '';
export const renderAsync = async () => '';
export const toPlainText = () => '';

// component stubs
export const Body = () => null;
export const Button = () => null;
export const CodeBlock = () => null;
export const Column = () => null;
export const Container = () => null;
export const Font = () => null;
export const Head = () => null;
export const Heading = () => null;
export const Hr = () => null;
export const Html = () => null;
export const Img = () => null;
export const Link = () => null;
export const Markdown = () => null;
export const Preview = () => null;
export const Row = () => null;
export const Section = () => null;
export const Tailwind = () => null;
export const Text = () => null;

// code-block theme stub
export const dracula = {};

// PrismLanguage type is only used as a type import, but the wildcard
// import (`* as ReactEmailComponents`) needs the module to be valid.
export type PrismLanguage = string;
