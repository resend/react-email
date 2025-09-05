import { type CssNode, walk } from 'css-tree';

// This expands the definition for CssNode so that we can add a parent property to all nodes
declare module 'css-tree' {
  interface CssNodeCommon {
    parent?: CssNode;
  }
}

export function populateParentsForNodeTree(node: CssNode): void {
  const parentPath: CssNode[] = [];
  walk(node, {
    enter(child: CssNode) {
      child.parent = parentPath[0];
      parentPath.unshift(child);
    },
    leave() {
      parentPath.shift();
    },
  });
}
