/**
 * Bubble menu events registered on the shared EditorEventMap
 * via TypeScript module augmentation.
 */
declare module '../../core/event-bus' {
  interface EditorEventMap {
    'bubble-menu:add-link': undefined;
  }
}

// Force this file to be a module so the augmentation takes effect
export {};
