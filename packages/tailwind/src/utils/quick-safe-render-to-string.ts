/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from "react";

const propToAttributeString = (propValue: string | object) => {
  if (typeof propValue === "string") return propValue;
  else if (typeof propValue === "object") return JSON.stringify(propValue);
};

/**
 * This was originally written due to react making sync `react-dom/server` APIs
 * legacy and making it almost impossible for this component to be used on NextJS 14
 * but this also makes the Tailwind component faster due to the fact that it runs through
 * the elements and directly converts props into attributes and element names into
 * tag names.
 *
 * This also renders the components by calling them directly and then using their returned value
 * to compute the rest of the HTML markup tree.
 */
export const quickSafeRenderToString = (element: React.ReactNode): string => {
  if (typeof element === "string" || typeof element === "number") {
    return String(element);
  }

  if (Array.isArray(element)) {
    return element.map(quickSafeRenderToString).join("");
  }

  if (React.isValidElement(element)) {
    const { type, props } = element;

    if (typeof type === "function") {
      const functionComponent = type as React.FC;
      // If the element is a component (function component), render it
      const componentRenderingResults = functionComponent(props);
      return quickSafeRenderToString(componentRenderingResults);
    }

    // Regular HTML-like element
    let elementAttributes = Object.keys(props || {})
      .filter((propName) => propName !== "children")
      .map((prop) => `${prop}="${propToAttributeString(props[prop])}"`)
      .join(" ");
    elementAttributes =
      elementAttributes.trim().length > 0 ? ` ${elementAttributes}` : "";
    const children = props && "children" in props ? props.children : "";
    const renderedChildren = children ? quickSafeRenderToString(children) : "";
    return typeof element.type === "symbol"
      ? renderedChildren
      : `<${element.type.toString()}${elementAttributes}>${renderedChildren}</${element.type.toString()}>`;
  }

  // Unhandled case, return an empty string
  return "";
};
