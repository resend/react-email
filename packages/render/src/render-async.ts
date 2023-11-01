/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { convert } from "html-to-text";
import pretty from "pretty";
import type { ReactDOMServerReadableStream } from "react-dom/server";

const readStream = async (readableStream: ReactDOMServerReadableStream) => {
  const reader = readableStream.getReader();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chunks: any[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-await-in-loop
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return chunks.map((chunk) => new TextDecoder("utf-8").decode(chunk)).join("");
};

export const renderAsync = async (
  component: React.ReactElement,
  options?: {
    pretty?: boolean;
    plainText?: boolean;
  },
) => {
  const reactDOMServer = (await import("react-dom/server")).default;
  const renderToStream =
    reactDOMServer.renderToReadableStream ||
    reactDOMServer.renderToString ||
    reactDOMServer.renderToPipeableStream;

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const readableStream = await renderToStream(component);
  const html =
    typeof readableStream === "string"
      ? readableStream
      : await readStream(readableStream);

  if (options?.plainText) {
    return convert(html, {
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "#__react-email-preview", format: "skip" },
      ],
    });
  }

  const document = `${doctype}${html}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
