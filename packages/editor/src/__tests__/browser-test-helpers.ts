/**
 * Shared helpers for browser-level component tests.
 *
 * These utilities simulate clipboard and drag-drop interactions that require
 * a real browser environment (DataTransfer, ClipboardEvent, etc.).
 */

/**
 * Simulates pasting plain text into an element by dispatching a ClipboardEvent
 * with the given text set as `text/plain` in the DataTransfer.
 */
export function pasteText(element: Element, text: string): void {
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', text);
  element.dispatchEvent(
    new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    }),
  );
}

/**
 * Simulates pasting HTML content into an element by dispatching a ClipboardEvent
 * with the given markup set as `text/html` in the DataTransfer.
 */
export function pasteHtml(element: Element, html: string): void {
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/html', html);
  element.dispatchEvent(
    new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    }),
  );
}
