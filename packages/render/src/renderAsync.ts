import { convert } from "html-to-text";
import pretty from "pretty";
import { type ReactNode } from "react";
import { renderToReadableStream, renderToStaticMarkup } from "react-dom/server";
import { type ReadableStream } from "node:stream/web";

export default async function renderToString(children: ReactNode) {
  const stream = await renderToReadableStream(children);

  const html = await readableStreamToString(
    // ReactDOMServerReadableStream behaves like ReadableStream
    // in modern edge runtimes but the types are not compatible
    stream as unknown as ReadableStream<Uint8Array>,
  );

  return (
    html
      // Remove leading doctype becuase we add it manually
      .replace(/^<!DOCTYPE html>/, "")
      // Remove empty comments to match the output of renderToStaticMarkup
      .replace(/<!-- -->/g, "")
  );
}

async function readableStreamToString(
  readableStream: ReadableStream<Uint8Array>,
) {
  let result = "";

  const decoder = new TextDecoder();

  for await (const chunk of readableStream) {
    result += decoder.decode(chunk);
  }

  return result;
}

export const renderAsync = async (
  component: React.ReactElement,
  options?: {
    pretty?: boolean;
    plainText?: boolean;
  },
) => {
  const markup =
    typeof renderToStaticMarkup === "undefined"
      ? await renderToString(component)
      : renderToStaticMarkup(component);

  if (options?.plainText) {
    return convert(markup, {
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "#__react-email-preview", format: "skip" },
      ],
    });
  }

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const document = `${doctype}${markup}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
