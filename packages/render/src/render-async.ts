import { convert } from "html-to-text";
import type {
  PipeableStream,
  ReactDOMServerReadableStream,
} from "react-dom/server";
import { pretty } from "./utils/pretty";
import { plainTextSelectors } from "./plain-text-selectors";
import type { Options } from "./options";

const decoder = new TextDecoder("utf-8");

const readStream = async (
  stream: PipeableStream | ReactDOMServerReadableStream,
) => {
  let result = "";

  if ("pipeTo" in stream) {
    // means it's a readable stream
    const writableStream = new WritableStream({
      write(chunk: BufferSource) {
        result += decoder.decode(chunk);
      },
    });
    await stream.pipeTo(writableStream);
  } else {
    // Using an `await import` here proved to cause issues when running
    // inside of Node's VM after `esbuild` would have this compiled to CJS.
    //
    // See https://github.com/resend/react-email/blob/c56cb71ab61a718ee932048a08b65185daeeafa5/packages/react-email/src/utils/get-email-component.ts
    const { Writable } = require("node:stream") as typeof import("node:stream");
    const writable = new Writable({
      write(chunk: BufferSource, _encoding, callback) {
        result += decoder.decode(chunk);

        callback();
      },
    });
    stream.pipe(writable);

    return new Promise<string>((resolve, reject) => {
      writable.on("error", reject);
      writable.on("close", () => {
        resolve(result);
      });
    });
  }

  return result;
};

export const renderAsync = async (
  component: React.ReactElement,
  options?: Options,
) => {
  const reactDOMServer = await import("react-dom/server");

  let html!: string;
  if (Object.hasOwn(reactDOMServer, "renderToReadableStream")) {
    html = await readStream(
      await reactDOMServer.renderToReadableStream(component),
    );
  } else {
    await new Promise<void>((resolve, reject) => {
      const stream = reactDOMServer.renderToPipeableStream(component, {
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

  const document = `${doctype}${html}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
