/**
 * Type-safe event bus for editor communication.
 *
 * Uses browser CustomEvent API with typed dispatch/subscribe.
 * Events are prefixed with `@react-email/editor:` to avoid collisions.
 *
 * Third-party devs can extend via module augmentation:
 * ```ts
 * declare module '@react-email/editor' {
 *   interface EditorEventMap {
 *     'my-custom-event': { data: string };
 *   }
 * }
 * ```
 */

export interface EditorEventMap {
  'add-link': undefined;
}

export type EditorEventName = keyof EditorEventMap;

export type EventHandler<T extends EditorEventName> = (
  payload: EditorEventMap[T],
) => void | Promise<void>;

export interface EventSubscription {
  unsubscribe: () => void;
}

export interface DispatchOptions {
  target?: EventTarget;
}

const EVENT_PREFIX = '@react-email/editor:';

class EditorEventBus {
  private prefixEventName(eventName: EditorEventName): string {
    return `${EVENT_PREFIX}${eventName}`;
  }

  dispatch<T extends EditorEventName>(
    eventName: T,
    payload: EditorEventMap[T],
    options?: DispatchOptions,
  ): void {
    const target = options?.target ?? window;
    const prefixedEventName = this.prefixEventName(eventName);
    const event = new CustomEvent(prefixedEventName, {
      detail: payload,
      bubbles: false,
      cancelable: false,
    });

    target.dispatchEvent(event);
  }

  on<T extends EditorEventName>(
    eventName: T,
    handler: EventHandler<T>,
    options?: AddEventListenerOptions & { target?: EventTarget },
  ): EventSubscription {
    const target = options?.target ?? window;
    const prefixedEventName = this.prefixEventName(eventName);
    const abortController = new AbortController();

    const wrappedHandler = (event: Event) => {
      const customEvent = event as CustomEvent<EditorEventMap[T]>;
      const result = handler(customEvent.detail);

      if (result instanceof Promise) {
        result.catch((error) => {
          console.error(
            `Error in async event handler for ${prefixedEventName}:`,
            { event: customEvent.detail, error },
          );
        });
      }
    };

    const listenerOptions = {
      ...options,
      target: undefined,
      signal: abortController.signal,
    };

    target.addEventListener(prefixedEventName, wrappedHandler, listenerOptions);

    return {
      unsubscribe: () => {
        abortController.abort();
      },
    };
  }
}

export const editorEventBus = new EditorEventBus();
