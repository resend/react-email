/**
 * Event map for the bubble menu event bus.
 * Extensible via TypeScript module augmentation.
 */
export interface BubbleMenuEventMap {
  'add-link': undefined;
}

export type BubbleMenuEventName = keyof BubbleMenuEventMap;

export type BubbleMenuEventHandler<T extends BubbleMenuEventName> = (
  payload: BubbleMenuEventMap[T],
) => void | Promise<void>;

export interface BubbleMenuEventSubscription {
  unsubscribe: () => void;
}
