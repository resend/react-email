import type { NodeClickedEvent } from '../styles.js';
// TODO: Architecture violation - core imports from plugins.
// Fix: Move CustomVariable type to a shared types location (e.g., core/types.ts or @/types/editor/)
// since it's used by the event bus which is core infrastructure.
import type { CustomVariable } from '../plugins/variables/extension.js';

export type EditorEventMap = {
  'node-clicked': NodeClickedEvent;
  'variables-updated': {
    customVariables?: Array<CustomVariable> | null;
  };
  'image-error': {
    message: string;
  };
  'add-link': undefined;
  'disable-focus-mode': undefined;
};

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

const EVENT_PREFIX = '@resend/editor:';

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
