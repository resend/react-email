import { useEffect } from 'react';

const EVENT_PREFIX = '@react-email/editor:';

/**
 * Base event map interface for the editor event bus.
 *
 * Components extend this via TypeScript module augmentation:
 * ```ts
 * declare module '@react-email/editor' {
 *   interface EditorEventMap {
 *     'my-component:custom-event': { data: string };
 *   }
 * }
 * ```
 */
export interface EditorEventMap {
  'bubble-menu:add-link': undefined;
}

export type EditorEventName = keyof EditorEventMap;

export type EditorEventHandler<T extends EditorEventName> = (
  payload: EditorEventMap[T],
) => void | Promise<void>;

export interface EditorEventSubscription {
  unsubscribe: () => void;
}

class EditorEventBus {
  private prefixEventName(eventName: EditorEventName): string {
    return `${EVENT_PREFIX}${String(eventName)}`;
  }

  dispatch<T extends EditorEventName>(
    eventName: T,
    payload: EditorEventMap[T],
    options?: { target?: EventTarget },
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

  useEvent<T extends EditorEventName>(
    eventName: T,
    handler: EditorEventHandler<T>,
    options?: AddEventListenerOptions & { target?: EventTarget },
  ) {
    useEffect(() => {
      const subscription = this.on(eventName, handler, options);

      return () => subscription.unsubscribe();
    }, [eventName, handler, options]);
  }

  on<T extends EditorEventName>(
    eventName: T,
    handler: EditorEventHandler<T>,
    options?: AddEventListenerOptions & { target?: EventTarget },
  ): EditorEventSubscription {
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

    target.addEventListener(prefixedEventName, wrappedHandler, {
      ...options,
      signal: abortController.signal,
    });

    return {
      unsubscribe: () => {
        abortController.abort();
      },
    };
  }
}

export const editorEventBus = new EditorEventBus();
