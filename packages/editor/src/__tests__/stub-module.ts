/**
 * Stub for `@react-email/render` in the Vite browser test environment.
 * The render package depends on Node-only modules (`prettier`) that
 * Vite cannot resolve in the browser. Only the render functions are
 * stubbed — components resolve from the real `react-email` source.
 */

export const plainTextSelectors = {};
export const pretty = async (html: string) => html;
export const render = async () => '';
export const renderAsync = async () => '';
export const toPlainText = () => '';
