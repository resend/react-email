import { describe, expect, it } from 'vitest';
import { updateScrollView } from './utils';

describe('updateScrollView', () => {
  function makeRect(top: number, bottom: number) {
    return {
      top,
      bottom,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => '',
    } as DOMRect;
  }

  function makeElement(rect: DOMRect, scrollTop = 0): HTMLElement {
    const el = {
      scrollTop,
      getBoundingClientRect: () => rect,
    } as unknown as HTMLElement;
    return el;
  }

  it('scrolls up when item is above the visible area', () => {
    const container = makeElement(makeRect(100, 200), 50);
    const item = makeElement(makeRect(80, 100));
    updateScrollView(container, item);
    // item.top (80) < container.top (100); diff = 20, scrollTop -= 20
    expect(container.scrollTop).toBe(30);
  });

  it('scrolls down when item is below the visible area', () => {
    const container = makeElement(makeRect(100, 200), 50);
    const item = makeElement(makeRect(180, 220));
    updateScrollView(container, item);
    // item.bottom (220) > container.bottom (200); diff = 20, scrollTop += 20
    expect(container.scrollTop).toBe(70);
  });

  it('does nothing when item is fully visible', () => {
    const container = makeElement(makeRect(100, 200), 50);
    const item = makeElement(makeRect(120, 180));
    updateScrollView(container, item);
    expect(container.scrollTop).toBe(50);
  });

  it('handles boundary case where item.top equals container.top', () => {
    const container = makeElement(makeRect(100, 200), 50);
    const item = makeElement(makeRect(100, 150));
    updateScrollView(container, item);
    expect(container.scrollTop).toBe(50);
  });
});
