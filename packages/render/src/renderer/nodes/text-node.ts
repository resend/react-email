import { Node, ParentNode } from "./node";

export class TextNode implements Node {
  id = Symbol("TextNode");

  text: string;
  parent?: ParentNode;

  hidden = false;

  constructor(text: string) {
    this.text = text;
  }

  get html() {
    if (this.hidden) return "";
    return this.text;
  }
}
