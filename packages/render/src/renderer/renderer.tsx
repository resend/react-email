import ReactServer from "react-server";
import { propToHtmlAttribute } from "./attribute-processing/prop-to-html-attribute";
import { escapeTextForBrowser } from "./escape-html";

export class Destination {
  html: string;
  decoder: TextDecoder;

  listeners: Array<
    [resolve: (value: string) => void, reject: (error: unknown) => void]
  >;

  constructor() {
    this.html = "";
    this.decoder = new TextDecoder("utf8", {
      fatal: true,
    });
    this.listeners = [];
  }

  write(content: string) {
    this.html += content;
  }

  writeEncoded(buffer: Uint8Array) {
    this.html += this.decoder.decode(buffer, { stream: true });
  }

  promise() {
    return new Promise<string>((resolve, reject) => {
      this.listeners.push([resolve, reject]);
    });
  }

  completeWithError(error: unknown) {
    this.listeners.forEach(([_, reject]) => reject(error));
  }

  complete() {
    this.listeners.forEach(([resolve]) => resolve(this.html));
  }
}

const encoder = new TextEncoder();

export const Renderer = ReactServer<Destination, null, null, null, number>({
  scheduleMicrotask(callback) {
    queueMicrotask(() => callback());
  },
  scheduleWork(callback) {
    setTimeout(() => {
      callback();
    });
  },
  beginWriting(destination) {},
  writeChunk(destination, buffer) {
    destination.writeEncoded(buffer);
  },
  writeChunkAndReturn(destination, buffer) {
    destination.writeEncoded(buffer);
    return true;
  },
  completeWriting(destination) {},
  close(destination) {
    destination.complete();
  },
  closeWithError(destination, error) {
    destination.completeWithError(error);
  },
  flushBuffered(destination) {},

  getChildFormatContext() {
    return null;
  },

  resetResumableState() {},
  completeResumableState() {},

  pushTextInstance(target, text, renderState, textEmbedded) {
    target.push(encoder.encode(escapeTextForBrowser(text)));
    return true;
  },
  pushStartInstance(target, type, props) {
    target.push(encoder.encode(`<${type}`));
    let dangerouslySetInnerHTML: { __html: string } | undefined = undefined;
    let children: React.ReactNode = undefined;
    for (const [name, value] of Object.entries(props)) {
      if (name === "children") {
        children = value;
        continue;
      } else if (name === "dangerouslySetInnerHTML") {
        dangerouslySetInnerHTML = value;
        continue;
      }
      target.push(encoder.encode(propToHtmlAttribute(name, value)));
    }
    target.push(encoder.encode(">"));

    if (dangerouslySetInnerHTML !== undefined) {
      if (children !== undefined) {
        throw new Error(
          "Can only set one of `children` or `props.dangerouslySetInnerHTML`.",
        );
      }
      if (
        typeof dangerouslySetInnerHTML !== "object" ||
        !("__html" in dangerouslySetInnerHTML)
      ) {
        throw new Error(
          "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. " +
            "Please visit https://react.dev/link/dangerously-set-inner-html " +
            "for more information.",
        );
      }
      const html = dangerouslySetInnerHTML.__html;
      if (html !== null && html !== undefined) {
        target.push(encoder.encode("" + html));
      }
    }

    if (
      typeof children === "string" ||
      typeof children === "number" ||
      typeof children === "boolean" ||
      typeof children === "bigint"
    ) {
      target.push(encoder.encode(escapeTextForBrowser("" + children)));
      return null;
    }
    return children;
  },

  pushEndInstance(target, type) {
    switch (type) {
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "img":
      case "input":
      case "keygen":
      case "link":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr": {
        return;
      }
    }
    target.push(encoder.encode(`</${type}>`));
  },

  pushSegmentFinale(target, _, lastPushedText, textEmbedded) {},

  writeCompletedRoot() {
    return true;
  },

  writePlaceholder() {
    return true;
  },

  writeStartCompletedSuspenseBoundary() {
    return true;
  },
  writeStartPendingSuspenseBoundary() {
    return true;
  },
  writeStartClientRenderedSuspenseBoundary() {
    return true;
  },
  writeEndCompletedSuspenseBoundary(destination) {
    return true;
  },
  writeEndPendingSuspenseBoundary(destination) {
    return true;
  },
  writeEndClientRenderedSuspenseBoundary(destination) {
    return true;
  },

  writeStartSegment(destination, renderState, formatContext, id): boolean {
    return true;
  },
  writeEndSegment(destination, formatContext): boolean {
    return true;
  },

  writeCompletedSegmentInstruction(destination, renderState, contentSegmentID) {
    return true;
  },

  writeCompletedBoundaryInstruction() {
    return true;
  },

  writeClientRenderBoundaryInstruction() {
    return true;
  },

  writePreamble(destination) {
    destination.write(
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    );
  },
  writeHoistables() {},
  writeHoistablesForBoundary() {},
  writePostamble() {},
  hoistHoistables(parent, child) {},
  createHoistableState() {
    return null;
  },
  emitEarlyPreloads() {},
});

