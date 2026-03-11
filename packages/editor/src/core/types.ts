/**
 * Core type definitions for the editor.
 * These types are used across the core module and can be imported by plugins and UI.
 */

import type { Attrs } from '@tiptap/pm/model';

export type NodeClickedEvent = {
  nodeType: string;
  nodeAttrs: Attrs;
  nodePos: { pos: number; inside: number };
};

/**
 * A single variable item with all metadata needed for rendering.
 * Used by the event bus and variable plugin.
 */
export interface VariableItem {
  /** Full variable string, e.g., '{{{contact.email}}}' */
  id: string;
  /** Display text shown in the dropdown, e.g., 'contact.email' */
  displayKey: string;
  /** Base key used for updates, e.g., 'contact' or the variable name */
  variableKey: string;
  /** Fallback value for the variable */
  fallbackValue: string | null;
  /** Category ID this variable belongs to */
  category: string;
  /** Variable type (string, number, boolean, object, list) - needed for loop item computation */
  type?: string;
  /** Override fallback warning for this specific variable */
  skipFallbackWarning?: boolean;
}

/**
 * Custom variable definition used in the variables plugin.
 */
export type CustomVariable = {
  id: string;
  key: string;
  type: string;
  fallback_value?: string | null;
};

/**
 * Event map for the editor event bus.
 */
export interface EditorEventMap {
  'node-clicked': NodeClickedEvent;
}

/**
 * Available event names in the editor event bus.
 */
export type EditorEventName = keyof EditorEventMap;

/**
 * Event handler function type.
 */
export type EventHandler<T extends EditorEventName> = (
  payload: EditorEventMap[T],
) => void | Promise<void>;

/**
 * Subscription handle returned when subscribing to events.
 */
export interface EventSubscription {
  unsubscribe: () => void;
}

/**
 * Options for dispatching events.
 */
export interface DispatchOptions {
  target?: EventTarget;
}
