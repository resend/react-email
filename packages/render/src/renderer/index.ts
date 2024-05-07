/* eslint-disable */
import createReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants.js";
import { ElementNode, Node, Root, TextNode } from "./element-node";

export const renderer = createReconciler<
  string,
  {
    className?: string;
    style?: React.CSSProperties;
  },
  Root,
  ElementNode,
  TextNode,
  Node,
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
  supportsHydration: false,

  supportsMicrotasks: true,
  scheduleMicrotask: queueMicrotask,

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  appendChildToContainer(container, child) {
    container.appendChild(child);
  },
  insertInContainerBefore(container, child, beforeChild) {
    container.insertBefore(child, beforeChild);
  },
  appendInitialChild(parent, child) {
    parent.appendChild(child);
  },
  insertBefore(parent, child, beforeChild) {
    parent.insertBefore(child, beforeChild);
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },

  removeChild(node, removeNode) {
    node.removeChild(removeNode);
  },
  removeChildFromContainer(container, node) {
    container.removeChild(node);
  },
  clearContainer: (container) => {
    for (const child of container.iterateChildren()) {
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
  resetAfterCommit() {},
  getChildHostContext(parentHostContext) {
    return parentHostContext;
  },

  shouldSetTextContent: () => false,
  resetTextContent() {},

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
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  detachDeletedInstance() {},
  getInstanceFromNode: () => null,
  prepareScopeUpdate() {},
  getInstanceFromScope: () => null,

  prepareUpdate() {
    return null;
  },
  commitUpdate() {},
});
