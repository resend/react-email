/**
 * Stub for `@react-email/render` and `@react-email/markdown` in the Vite
 * browser test environment. These packages depend on Node-only modules
 * (`prettier`, `md-to-react-email`) that Vite cannot resolve in the browser.
 *
 * The stubs satisfy the named exports that `@react-email/components`
 * barrel-re-exports, so that extensions importing individual components
 * (e.g. `{ Heading }`) from the components package can resolve correctly.
 */

// @react-email/render exports
export const plainTextSelectors = {};
export const pretty = async (html: string) => html;
export const render = async () => '';
export const renderAsync = async () => '';
export const toPlainText = () => '';

// @react-email/markdown exports
export const Markdown = () => null;
