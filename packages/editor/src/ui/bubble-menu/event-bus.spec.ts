import { editorBubbleMenuEventBus } from './event-bus';

describe('editorBubbleMenuEventBus', () => {
  it('dispatches and receives events', () => {
    const handler = vi.fn();
    const sub = editorBubbleMenuEventBus.on('add-link', handler);

    editorBubbleMenuEventBus.dispatch('add-link', undefined);

    expect(handler).toHaveBeenCalledOnce();
    sub.unsubscribe();
  });

  it('unsubscribes correctly', () => {
    const handler = vi.fn();
    const sub = editorBubbleMenuEventBus.on('add-link', handler);
    sub.unsubscribe();

    editorBubbleMenuEventBus.dispatch('add-link', undefined);

    expect(handler).not.toHaveBeenCalled();
  });
});
