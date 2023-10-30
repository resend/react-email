/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as ReactDomServer from "react-dom/server";
import { convert } from "html-to-text";
import pretty from "pretty";
import type {
  ReactDOMServerReadableStream,
  PipeableStream,
} from "react-dom/server";

export interface Options {
  pretty?: boolean;
  plainText?: boolean;
}

type CustomReadableStream = ReactDOMServerReadableStream | PipeableStream;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readPipeableStream = async (readableStream: any) => {
  let buffer = "";

  for await (const chunk of readableStream) {
    const chunkText = new TextDecoder("utf-8").decode(chunk);
    buffer += chunkText;
  }

  return buffer;
};

const readReactDOMServerReadableStream = async (
  readableStream: ReactDOMServerReadableStream,
) => {
  const reader = readableStream.getReader();
  const chunks: ArrayBuffer[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-unsafe-assignment
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }

  return chunks.map((chunk) => new TextDecoder("utf-8").decode(chunk)).join("");
};

const isPipeableStream = (
  stream: CustomReadableStream,
): stream is PipeableStream => "pipeTo" in stream;

const readStream = async (readableStream: CustomReadableStream) => {
  if (isPipeableStream(readableStream)) {
    return readPipeableStream(readableStream);
  } else if (typeof readableStream === "string") {
    return readableStream;
  }

  return readReactDOMServerReadableStream(readableStream);
};

export const render = async (
  component: React.ReactElement,
  options?: Options,
) => {
  const reactDOMServer = (await import("react-dom/server")).default;
  const renderToStream =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    reactDOMServer.renderToReadableStream ||
    reactDOMServer.renderToPipeableStream;

  if (options?.plainText) {
    return renderAsPlainText(component, options);
  }

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const readableStream = await renderToStream(component);
  const html = await readStream(readableStream);
  const document = `${doctype}${html}`;

  if (options && options.pretty) {
    return pretty(document);
  }

  return document;
};

const renderAsPlainText = (
  component: React.ReactElement,
  _options?: Options,
) => {
  return convert(ReactDomServer.renderToStaticMarkup(component), {
    selectors: [
      { selector: "img", format: "skip" },
      { selector: "#__react-email-preview", format: "skip" },
    ],
  });
};
