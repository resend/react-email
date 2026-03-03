import { editorEventBus } from '../../core/event-bus';
// Side-effect: registers bubble-menu events on EditorEventMap
import './types';

describe('editorEventBus (bubble-menu events)', () => {
  it('dispatches and receives bubble-menu:add-link', () => {
    const handler = vi.fn();
    const sub = editorEventBus.on('bubble-menu:add-link', handler);

    editorEventBus.dispatch('bubble-menu:add-link', undefined);

    expect(handler).toHaveBeenCalledOnce();
    sub.unsubscribe();
  });

  it('unsubscribes correctly', () => {
    const handler = vi.fn();
    const sub = editorEventBus.on('bubble-menu:add-link', handler);
    sub.unsubscribe();

    editorEventBus.dispatch('bubble-menu:add-link', undefined);

    expect(handler).not.toHaveBeenCalled();
  });
});
