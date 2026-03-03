import type {
  BubbleMenuEventHandler,
  BubbleMenuEventMap,
  BubbleMenuEventName,
  BubbleMenuEventSubscription,
} from './types';

const EVENT_PREFIX = '@react-email/editor:bubble-menu:';

class BubbleMenuEventBus {
  private prefixEventName(eventName: BubbleMenuEventName): string {
    return `${EVENT_PREFIX}${eventName}`;
  }

  dispatch<T extends BubbleMenuEventName>(
    eventName: T,
    payload: BubbleMenuEventMap[T],
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

  on<T extends BubbleMenuEventName>(
    eventName: T,
    handler: BubbleMenuEventHandler<T>,
    options?: AddEventListenerOptions & { target?: EventTarget },
  ): BubbleMenuEventSubscription {
    const target = options?.target ?? window;
    const prefixedEventName = this.prefixEventName(eventName);
    const abortController = new AbortController();

    const wrappedHandler = (event: Event) => {
      const customEvent = event as CustomEvent<BubbleMenuEventMap[T]>;
      handler(customEvent.detail);
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

export const editorBubbleMenuEventBus = new BubbleMenuEventBus();
