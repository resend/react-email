/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { convert } from "html-to-text";
import type { ReactDOMServerReadableStream } from "react-dom/server";
import { pretty } from "./utils/pretty";
import { plainTextSelectors } from "./plain-text-selectors";
import type { Options } from "./options";

const decoder = new TextDecoder("utf-8");

const readStream = async (
  readableStream: NodeJS.ReadableStream | ReactDOMServerReadableStream,
) => {
  let result = "";

  if ("allReady" in readableStream) {
    const reader = readableStream.getReader();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-await-in-loop
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      result += decoder.decode(value);
    }
  } else {
    for await (const chunk of readableStream) {
      result += decoder.decode(Buffer.from(chunk));
    }
  }

  return result;
};

export const renderAsync = async (
  component: React.ReactElement,
  options?: Options,
) => {
  const reactDOMServer = (await import("react-dom/server")).default;
  const renderToStream =
    reactDOMServer.renderToReadableStream ??
    reactDOMServer.renderToStaticNodeStream;

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const htmlOrReadableStream = await renderToStream(component);
  const html =
    typeof htmlOrReadableStream === "string"
      ? htmlOrReadableStream
      : await readStream(htmlOrReadableStream);

  if (options?.plainText) {
    return convert(html, {
      selectors: plainTextSelectors,
      ...options.htmlToTextOptions,
    });
  }

  const document = `${doctype}${html}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
