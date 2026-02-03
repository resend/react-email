/**
 * Core type definitions for the editor.
 * These types are used across the core module and can be imported by plugins and UI.
 */

import type { Content, Editor as EditorClass } from '@tiptap/core';
import type { ContextProperties, NodeClickedEvent } from '../styles.js';

// Re-export external types for convenience
export type { Content, EditorClass };
export type { ContextProperties, NodeClickedEvent };

/**
 * Reference to the editor instance, exposed via React ref.
 */
export type EditorRef = {
  getEditor: () => EditorClass | null;
};

/**
 * Editor metadata describing the context in which the editor is used.
 */
export interface EditorMetadata {
  objectType: 'broadcast' | 'template';
  objectId: string;
  config?: {
    enableTemplateLanguage?: boolean;
  };
}

/**
 * Event map for the editor event bus.
 */
export type EditorEventMap = {
  'node-clicked': NodeClickedEvent;
  'variables-updated': {
    customVariables?: Array<{ name: string; fallback?: string }> | null;
  };
  'image-error': {
    message: string;
  };
  'add-link': undefined;
  'disable-focus-mode': undefined;
};

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

/**
 * Global content data stored in the editor's GlobalContent extension.
 */
export interface GlobalContentData {
  theme: string;
  css: string;
  styles: Record<string, Record<string, string>>;
}

/**
 * Theme definition for the editor.
 */
export interface EditorTheme {
  name: string;
  styles: Record<string, Record<string, string>>;
}
