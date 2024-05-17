import React from "react";
import { convertPropsIntoAttributes } from "../property-mapping";
import { ParentNode, Node } from "./node";

export class ElementNode extends ParentNode {
  private props: Record<string, unknown>;
  private internalTag: string;

  hidden = false;

  parent?: ParentNode;

  constructor(
    tag: string,
    props: Record<string, unknown>,
  ) {
    super(Symbol("ElementNode"), []);
    this.internalTag = tag;
    this.props = props;

    //const childrenAsArray = (
    //  Array.isArray(props.children) ? props.children : [props.children]
    //) as React.ReactNode[];
    //for (const child of childrenAsArray) {
    //  if (
    //    React.isValidElement(child) &&
    //    typeof child.type === "symbol" &&
    //    Symbol.keyFor(child.type) === "react.suspense"
    //  ) {
    //  }
    //}
  }

  get tag() {
    return this.internalTag;
  }

  get html() {
    if (this.hidden) return "";

    const attributes = convertPropsIntoAttributes(this.props);

    const attributePortion =
      attributes.trim().length > 0 ? ` ${attributes}` : "";
    const childrenPortion = this.internalChildren
      .map((child) => child.html)
      .join("");
    return `<${this.internalTag}${attributePortion}>${childrenPortion}</${this.internalTag}>`;
  }

  get children(): readonly Node[] {
    return this.internalChildren;
  }
}
