import { type CssNode, type List, type ListItem, walk } from 'css-tree';

// This expands the definition for CssNode so that we can add a parent property to all nodes
declare module 'css-tree' {
  interface CssNodeCommon {
    parent?: CssNode;
    parentListItem?: ListItem<CssNode>;
    parentList?: List<CssNode>;
  }
}

export function populateParentsForNodeTree(node: CssNode): void {
  const parentPath: CssNode[] = [];
  walk(node, {
    enter(
      child: CssNode,
      parentListItem: ListItem<CssNode>,
      parentList: List<CssNode>,
    ) {
      child.parent = parentPath[0];
      child.parentListItem = parentListItem;
      child.parentList = parentList;
      parentPath.unshift(child);
    },
    leave() {
      parentPath.shift();
    },
  });
}
