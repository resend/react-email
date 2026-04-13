import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDragToChange } from './use-drag-to-change';

function createPointerEvent(overrides: Partial<React.PointerEvent> = {}) {
  return {
    preventDefault: vi.fn(),
    clientX: 0,
    pointerId: 1,
    shiftKey: false,
    currentTarget: {
      setPointerCapture: vi.fn(),
    } as unknown as HTMLElement,
    ...overrides,
  } as unknown as React.PointerEvent;
}

describe('useDragToChange', () => {
  it('calls onCommit with delta value on pointer move after pointer down', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useDragToChange({ value: 10, onCommit }),
    );

    act(() => {
      result.current.dragProps.onPointerDown(
        createPointerEvent({ clientX: 100 }),
      );
    });

    act(() => {
      result.current.dragProps.onPointerMove(
        createPointerEvent({ clientX: 110 }),
      );
    });

    expect(onCommit).toHaveBeenCalledWith(15);
  });

  it('does not call onCommit on pointer move without pointer down', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useDragToChange({ value: 10, onCommit }),
    );

    act(() => {
      result.current.dragProps.onPointerMove(
        createPointerEvent({ clientX: 110 }),
      );
    });

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('stops tracking after pointer up', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useDragToChange({ value: 10, onCommit }),
    );

    act(() => {
      result.current.dragProps.onPointerDown(
        createPointerEvent({ clientX: 100 }),
      );
    });

    act(() => {
      result.current.dragProps.onPointerUp();
    });

    act(() => {
      result.current.dragProps.onPointerMove(
        createPointerEvent({ clientX: 120 }),
      );
    });

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('respects step parameter', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useDragToChange({ value: 0, onCommit, step: 5 }),
    );

    act(() => {
      result.current.dragProps.onPointerDown(
        createPointerEvent({ clientX: 0 }),
      );
    });

    act(() => {
      result.current.dragProps.onPointerMove(
        createPointerEvent({ clientX: 4 }),
      );
    });

    expect(onCommit).toHaveBeenCalledWith(10);
  });

  it('sets cursor to ew-resize during drag', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useDragToChange({ value: 0, onCommit }),
    );

    act(() => {
      result.current.dragProps.onPointerDown(
        createPointerEvent({ clientX: 0 }),
      );
    });

    expect(document.body.style.cursor).toBe('ew-resize');

    act(() => {
      result.current.dragProps.onPointerUp();
    });

    expect(document.body.style.cursor).toBe('');
  });

  it('clamps to min value', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useDragToChange({ value: 5, onCommit, min: 0 }),
    );

    act(() => {
      result.current.dragProps.onPointerDown(
        createPointerEvent({ clientX: 100 }),
      );
    });

    act(() => {
      result.current.dragProps.onPointerMove(
        createPointerEvent({ clientX: 80 }),
      );
    });

    expect(onCommit).toHaveBeenCalledWith(0);
  });

  it('returns ew-resize cursor style in dragProps', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useDragToChange({ value: 0, onCommit }),
    );

    expect(result.current.dragProps.style.cursor).toBe('ew-resize');
  });
});
