export interface Node {
  id: symbol;
  html: string;

  parent?: ParentNode;
}

export abstract class ParentNode implements Node {
  constructor(
    public id: symbol,
    protected internalChildren: Node[],
  ) {}

  removeChild(child: Node) {
    child.parent = undefined;
    this.internalChildren = this.internalChildren.filter(
      (otherChild) => otherChild.id !== child.id,
    );
  }

  insertBefore(toInsert: Node, nodeToInsertBeforeOf: Node) {
    const index = this.internalChildren.findIndex(
      (node) => node.id === nodeToInsertBeforeOf.id,
    );
    if (index > -1) {
      toInsert.parent = this;
      this.internalChildren.splice(index, 0, toInsert);
    }
  }

  appendChild(child: Node) {
    child.parent = this;
    this.internalChildren.push(child);
  }

  get children(): readonly Node[] {
    return this.internalChildren;
  }

  abstract get html(): string;
}

export function nextSiblingOf(node: Node) {
  if (node.parent) {
    const index = node.parent.children.findIndex(
      (child) => child.id === node.id,
    );

    if (index + 1 < node.parent.children.length) {
      return node.parent.children[index + 1];
    }
  }

  return null;

}

export function previousSiblingOf(node: Node) {
  if (node.parent) {
    const index = node.parent.children.findIndex(
      (child) => child.id === node.id,
    );

    if (index >= 1) {
      return node.parent.children[index - 1];
    }
  }

  return null;
}
