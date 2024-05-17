import { ParentNode } from "./node";

export class Root extends ParentNode {
  constructor() {
    super(Symbol("RootNode"), []);
  }

  get html() {
    return this.internalChildren.map((child) => child.html).join("");
  }
}
