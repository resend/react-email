import { ConcurrentRoot } from "react-reconciler/constants";
import { Fiber } from "react-reconciler";
import { convert } from "html-to-text";
import { renderer } from "./renderer";
import { Root } from "./renderer/nodes/root";
import { Options } from "./options";
import { plainTextSelectors } from "./plain-text-selectors";
import { pretty } from "./utils/pretty";

/**
 * Checks recursively through React's fibers to make sure that all suspense
 * boundaries are complete. It uses the fact that, once they are complete,
 * they will have a `memoizedState` of null. It also checks for an element being
 * a Suspense boundary by looking for an internal React field in the fibers.
 *
 * There is currently no other way that can be used to wait for these
 * Suspense boundaries to be done except for checking the fibers themselves.
 *
 * NOTE: this code is very fragile and should be tested very carefully
 * with each `react-reconciler` update. This is because React might change
 * these internal structures and cause this code to break.
 */
function checkIfAllSuspensesAreDone(fiber: Fiber) {
  if (fiber.tag === 13 && fiber.memoizedState !== null) {
    // Suspense boundary is still pending
    return false;
  }
  let child = fiber.child;
  while (child !== null) {
    if (!checkIfAllSuspensesAreDone(child)) {
      return false;
    }
    child = child.sibling;
  }
  return true;
}

const renderToMarkup = (element: React.ReactElement) => {
  return new Promise<string>((resolve, reject) => {
    const root = new Root();

    const container = renderer.createContainer(
      root,
      ConcurrentRoot,
      {},
      false,
      true,
      "",
      (err) => {
        reject(err);
      },
      {},
    ) as {
      current: Fiber;
    };

    renderer.updateContainer(element, container, null, () => {
      function checkCompletion() {
        if (checkIfAllSuspensesAreDone(container.current)) {
          resolve(root.html);
        } else {
          // We check again after the current stack for the event loop is finished,
          // meaning that Suspense will already have retried.
          setTimeout(checkCompletion, 0);
        }
      }

      checkCompletion();
    });
  });
};

export const doctype =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

export const render = async (
  element: React.ReactElement,
  options?: Options,
) => {
  const markup = await renderToMarkup(element);

  const document = `${doctype}${markup}`;

  if (options?.plainText) {
    return convert(document, {
      selectors: plainTextSelectors,
      ...options.htmlToTextOptions,
    });
  }

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
