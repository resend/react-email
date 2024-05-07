import { convertPropsIntoAttributes } from "./property-mapping";

export interface Node {
  id: symbol;
  html: string;
}

export class TextNode implements Node {
  id = Symbol("TextNode");

  text: string;

  hidden = false;

  constructor(text: string) {
    this.text = text;
  }

  get html() {
    if (this.hidden) return '';
    return this.text;
  }
}

export class Root {
  private internalChildren: Node[];

  constructor() {
    this.internalChildren = [];
  }

  *iterateChildren() {
    for (const child of this.internalChildren) {
      yield child;
    }
  }

  removeChild(child: Node) {
    this.internalChildren = this.internalChildren.filter(
      (otherChild) => otherChild.id !== child.id,
    );
  }

  insertBefore(toInsert: Node, nodeToInsertBeforeOf: Node) {
    const index = this.internalChildren.findIndex(
      (node) => node.id === nodeToInsertBeforeOf.id,
    );
    if (index > -1) {
      this.internalChildren.splice(index, 0, toInsert);
    }
  }

  appendChild(child: Node) {
    this.internalChildren.push(child);
  }

  get html() {
    return this.internalChildren.map((child) => child.html).join("");
  }
}

export class ElementNode implements Node {
  private props: Record<string, unknown>;
  private internalChildren: Node[];
  private internalTag: string;

  hidden = false;

  id = Symbol("ElementNode");

  constructor(tag: string, props: Record<string, unknown>) {
    this.internalTag = tag;
    this.props = props;
    this.internalChildren = [];
  }

  get tag() {
    return this.internalTag;
  }

  *iterateChildren() {
    for (const child of this.internalChildren) {
      yield child;
    }
  }

  get html() {
    if (this.hidden) return '';

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

  removeChild(child: Node) {
    this.internalChildren = this.internalChildren.filter(
      (otherChild) => otherChild.id !== child.id,
    );
  }

  insertBefore(toInsert: Node, nodeToInsertBeforeOf: Node) {
    const index = this.internalChildren.findIndex(
      (node) => node.id === nodeToInsertBeforeOf.id,
    );
    if (index > -1) {
      this.internalChildren.splice(index, 0, toInsert);
    }
  }

  appendChild(child: Node) {
    this.internalChildren.push(child);
  }
}
