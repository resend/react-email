import { editorEventBus } from './event-bus.js';

// Augment EditorEventMap with test-only events
declare module './event-bus' {
  interface EditorEventMap {
    'test:simple': undefined;
    'test:with-payload': { message: string };
  }
}

describe('EditorEventBus', () => {
  it('dispatches and receives events with no payload', () => {
    const handler = vi.fn();
    const sub = editorEventBus.on('test:simple', handler);

    editorEventBus.dispatch('test:simple', undefined);

    expect(handler).toHaveBeenCalledOnce();
    // CustomEvent serializes undefined detail to null
    expect(handler).toHaveBeenCalledWith(null);
    sub.unsubscribe();
  });

  it('dispatches and receives events with payload', () => {
    const handler = vi.fn();
    const sub = editorEventBus.on('test:with-payload', handler);

    editorEventBus.dispatch('test:with-payload', { message: 'hello' });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ message: 'hello' });
    sub.unsubscribe();
  });

  it('unsubscribes correctly', () => {
    const handler = vi.fn();
    const sub = editorEventBus.on('test:simple', handler);
    sub.unsubscribe();

    editorEventBus.dispatch('test:simple', undefined);

    expect(handler).not.toHaveBeenCalled();
  });

  it('supports multiple subscribers', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const sub1 = editorEventBus.on('test:simple', handler1);
    const sub2 = editorEventBus.on('test:simple', handler2);

    editorEventBus.dispatch('test:simple', undefined);

    expect(handler1).toHaveBeenCalledOnce();
    expect(handler2).toHaveBeenCalledOnce();
    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  it('unsubscribing one handler does not affect others', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const sub1 = editorEventBus.on('test:simple', handler1);
    const sub2 = editorEventBus.on('test:simple', handler2);

    sub1.unsubscribe();
    editorEventBus.dispatch('test:simple', undefined);

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledOnce();
    sub2.unsubscribe();
  });

  it('dispatches to custom target', () => {
    const target = new EventTarget();
    const handler = vi.fn();
    const sub = editorEventBus.on('test:simple', handler, { target });

    editorEventBus.dispatch('test:simple', undefined, { target });

    expect(handler).toHaveBeenCalledOnce();
    sub.unsubscribe();
  });

  it('handles async error in handler without throwing', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const handler = vi.fn().mockRejectedValue(new Error('async failure'));
    const sub = editorEventBus.on('test:simple', handler);

    editorEventBus.dispatch('test:simple', undefined);

    expect(handler).toHaveBeenCalledOnce();
    // The error is caught internally; the dispatch itself does not throw
    sub.unsubscribe();
    consoleError.mockRestore();
  });
});
