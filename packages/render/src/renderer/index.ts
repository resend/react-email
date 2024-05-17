/* eslint-disable */
import createReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants.js";
import { ElementNode } from "./nodes/element-node";
import { Root } from "./nodes/root";
import { TextNode } from "./nodes/text-node";

export const renderer = createReconciler<
  string,
  {
    className?: string;
    style?: React.CSSProperties;
  },
  Root,
  ElementNode,
  TextNode,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>({
  isPrimaryRenderer: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: true,

  supportsMicrotasks: true,
  scheduleMicrotask: queueMicrotask,

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  appendChildToContainer(container, child) {
    container.appendChild(child);
  },
  insertInContainerBefore(container, child, beforeChild: ElementNode | TextNode) {
    container.insertBefore(child, beforeChild);
  },

  appendInitialChild(parent, child) {
    parent.appendChild(child);
  },
  insertBefore(parent, child, beforeChild: ElementNode | TextNode) {
    parent.insertBefore(child, beforeChild);
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },

  removeChild(node, removeNode: ElementNode | TextNode) {
    node.removeChild(removeNode);
  },
  removeChildFromContainer(container, node: ElementNode | TextNode) {
    container.removeChild(node);
  },
  clearContainer: (container) => {
    for (const child of container.children) {
      container.removeChild(child);
    }
  },

  getRootHostContext: () => ({}),
  createInstance(type, props) {
    return new ElementNode(type, props);
  },
  createTextInstance(text) {
    return new TextNode(text);
  },
  prepareForCommit: () => null,
  preparePortalMount: () => null,
  commitTextUpdate(node, _oldText, newText) {
    node.text = newText;
  },
  resetAfterCommit() { },
  getChildHostContext(parentHostContext) {
    return parentHostContext;
  },

  shouldSetTextContent: () => false,
  resetTextContent() { },

  hideTextInstance(node) {
    node.hidden = true;
  },
  unhideTextInstance(node) {
    node.hidden = false;
  },
  getPublicInstance: (instance) => instance,
  hideInstance(node) {
    node.hidden = true;
  },
  unhideInstance(node) {
    node.hidden = false;
  },
  finalizeInitialChildren: () => false,
  getCurrentEventPriority: () => DefaultEventPriority,
  beforeActiveInstanceBlur() { },
  afterActiveInstanceBlur() { },
  detachDeletedInstance() { },
  getInstanceFromNode: () => null,
  prepareScopeUpdate() { },
  getInstanceFromScope: () => null,

  prepareUpdate() {
    return null;
  },
  commitUpdate() { },
});
