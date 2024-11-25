/* eslint-disable @typescript-eslint/no-empty-function */
import ReactServer from "react-server";
import {
  PropValue,
  propToHtmlAttribute,
} from "./attribute-processing/prop-to-html-attribute";
import { escapeTextForBrowser } from "./escape-html";

export class Destination {
  html: string;
  decoder: TextDecoder;

  listeners: [
    resolve: (value: string) => void,
    reject: (error: unknown) => void,
  ][];

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
    this.listeners.forEach(([_, reject]) => {
      reject(error);
    });
  }

  complete() {
    this.listeners.forEach(([resolve]) => {
      resolve(this.html);
    });
  }
}

const encoder = new TextEncoder();

export const Renderer = ReactServer<Destination, null, null, null, number>({
  scheduleMicrotask(callback) {
    queueMicrotask(() => {
      callback();
    });
  },
  scheduleWork(callback) {
    setTimeout(() => {
      callback();
    });
  },
  beginWriting() { },
  writeChunk(destination, buffer) {
    destination.writeEncoded(buffer);
  },
  writeChunkAndReturn(destination, buffer) {
    destination.writeEncoded(buffer);
    return true;
  },
  completeWriting() { },
  close(destination) {
    destination.complete();
  },
  closeWithError(destination, error) {
    destination.completeWithError(error);
  },
  flushBuffered() { },

  getChildFormatContext() {
    return null;
  },

  resetResumableState() { },
  completeResumableState() { },

  pushTextInstance(target, text, _renderState, _textEmbedded) {
    target.push(encoder.encode(escapeTextForBrowser(text)));
    return true;
  },
  pushStartInstance(target, type, props) {
    target.push(encoder.encode(`<${type}`));
    let dangerouslySetInnerHTML: unknown;
    let children: unknown;
    for (const [name, value] of Object.entries(props)) {
      if (name === "children") {
        children = value;
        continue;
      } else if (name === "dangerouslySetInnerHTML") {
        dangerouslySetInnerHTML = value;
        continue;
      }
      target.push(
        encoder.encode(propToHtmlAttribute(name, value as PropValue)),
      );
    }
    target.push(encoder.encode(">"));

    if (dangerouslySetInnerHTML !== undefined) {
      if (children !== undefined) {
        throw new Error(
          "Can only set one of `children` or `props.dangerouslySetInnerHTML`.",
        );
      }
      if (
        !dangerouslySetInnerHTML ||
        typeof dangerouslySetInnerHTML !== "object" ||
        !("__html" in dangerouslySetInnerHTML) ||
        typeof dangerouslySetInnerHTML.__html !== "string"
      ) {
        throw new Error(
          "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. " +
          "Please visit https://react.dev/link/dangerously-set-inner-html " +
          "for more information.",
        );
      }
      const html = dangerouslySetInnerHTML.__html;
      target.push(encoder.encode(html));
    }

    if (
      typeof children === "string" ||
      typeof children === "number" ||
      typeof children === "boolean" ||
      typeof children === "bigint"
    ) {
      target.push(encoder.encode(escapeTextForBrowser(`${children}`)));
      return null;
    }
    return children as React.ReactNode;
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

  pushSegmentFinale() { },

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
  writeEndCompletedSuspenseBoundary() {
    return true;
  },
  writeEndPendingSuspenseBoundary() {
    return true;
  },
  writeEndClientRenderedSuspenseBoundary() {
    return true;
  },

  writeStartSegment() {
    return true;
  },
  writeEndSegment() {
    return true;
  },

  writeCompletedSegmentInstruction() {
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
  writeHoistables() { },
  writeHoistablesForBoundary() { },
  writePostamble() { },
  hoistHoistables() { },
  createHoistableState() {
    return null;
  },
  emitEarlyPreloads() { },
});
