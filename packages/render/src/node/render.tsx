import { convert } from "html-to-text";
import { Suspense } from "react";
import { pretty } from "../shared/utils/pretty";
import { plainTextSelectors } from "../shared/plain-text-selectors";
import type { Options } from "../shared/options";
import { readStream } from "../shared/read-stream";

export const render = async (
  element: React.ReactElement,
  options?: Options,
) => {
  const suspendedElement = <Suspense>{element}</Suspense>;
  const { default: reactDOMServer } = await import("react-dom/server");

  let html!: string;
  if (Object.hasOwn(reactDOMServer, "renderToReadableStream")) {
    html = await readStream(
      await reactDOMServer.renderToReadableStream(suspendedElement),
    );
  } else {
    await new Promise<void>((resolve, reject) => {
      const stream = reactDOMServer.renderToPipeableStream(suspendedElement, {
        async onAllReady() {
          html = await readStream(stream);
          resolve();
        },
        onError(error) {
          reject(error as Error);
        },
      });
    });
  }

  if (options?.plainText) {
    return convert(html, {
      selectors: plainTextSelectors,
      ...options.htmlToTextOptions,
    });
  }

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, "")}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
