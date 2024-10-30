import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { Suspense } from "react";
import { convert } from "html-to-text";
import { Options } from "../shared/options";
import { pretty } from "../shared/pretty";
import { plainTextSelectors } from "../shared/plain-text-selectors";

export async function render(
  element: React.ReactElement,
  options?: Options,
): Promise<string> {
  const suspendedElement = <Suspense>{element}</Suspense>;
  const html = await new Promise<string>((resolve, reject) => {
    let htmlChunksString = "";

    const writable = new Writable({
      write(chunk: Buffer, _encoding, callback) {
        htmlChunksString += chunk.toString();
        callback();
      },
    });

    writable.on("finish", () => {
      resolve(htmlChunksString);
    });

    writable.on("error", (err) => {
      reject(err);
    });

    const stream = renderToPipeableStream(suspendedElement, {
      onAllReady() {
        stream.pipe(writable);
      },
      onError(error) {
        reject(error as Error);
      },
    });
  });

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
}
