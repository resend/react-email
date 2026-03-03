/**
 * Bubble menu events are declared directly in EditorEventMap
 * (packages/editor/src/core/event-bus.ts) since they ship with
 * the package. This file is kept as documentation of the pattern
 * for consumers who want to add their own events via module
 * augmentation:
 *
 * ```ts
 * declare module '@react-email/editor' {
 *   interface EditorEventMap {
 *     'my-component:custom-event': { data: string };
 *   }
 * }
 * ```
 */
export {};
