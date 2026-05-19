import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useNumericInput } from './use-numeric-input';

function createKeyboardEvent(
  key: string,
  overrides: Partial<React.KeyboardEvent<HTMLInputElement>> = {},
) {
  return {
    key,
    preventDefault: vi.fn(),
    shiftKey: false,
    target: {
      blur: vi.fn(),
      select: vi.fn(),
    } as unknown as HTMLInputElement,
    ...overrides,
  } as unknown as React.KeyboardEvent<HTMLInputElement>;
}

describe('useNumericInput', () => {
  it('initializes displayValue from value prop', () => {
    const { result } = renderHook(() =>
      useNumericInput({ value: 42, onCommit: vi.fn() }),
    );

    expect(result.current.displayValue).toBe('42');
  });

  it('arrow up increments value by 1', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: 10, onCommit }),
    );

    act(() => {
      result.current.onKeyDown(createKeyboardEvent('ArrowUp'));
    });

    expect(onCommit).toHaveBeenCalledWith(11);
    expect(result.current.displayValue).toBe('11');
  });

  it('arrow down decrements value by 1', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: 10, onCommit }),
    );

    act(() => {
      result.current.onKeyDown(createKeyboardEvent('ArrowDown'));
    });

    expect(onCommit).toHaveBeenCalledWith(9);
    expect(result.current.displayValue).toBe('9');
  });

  it('shift+arrow up increments by 10', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: 10, onCommit }),
    );

    act(() => {
      result.current.onKeyDown(
        createKeyboardEvent('ArrowUp', { shiftKey: true }),
      );
    });

    expect(onCommit).toHaveBeenCalledWith(20);
    expect(result.current.displayValue).toBe('20');
  });

  it('shift+arrow down decrements by 10', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: 30, onCommit }),
    );

    act(() => {
      result.current.onKeyDown(
        createKeyboardEvent('ArrowDown', { shiftKey: true }),
      );
    });

    expect(onCommit).toHaveBeenCalledWith(20);
    expect(result.current.displayValue).toBe('20');
  });

  it('clamps to min on arrow down', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: 2, onCommit, min: 0 }),
    );

    act(() => {
      result.current.onKeyDown(
        createKeyboardEvent('ArrowDown', { shiftKey: true }),
      );
    });

    expect(onCommit).toHaveBeenCalledWith(0);
    expect(result.current.displayValue).toBe('0');
  });

  it('clamps to min on arrow up does not go below min', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: -5, onCommit, min: 0 }),
    );

    act(() => {
      result.current.onKeyDown(createKeyboardEvent('ArrowUp'));
    });

    expect(onCommit).toHaveBeenCalledWith(0);
  });

  it('commits on blur', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: 10, onCommit }),
    );

    act(() => {
      result.current.onFocus({
        target: { select: vi.fn() },
      } as unknown as React.FocusEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { value: '25' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onBlur();
    });

    expect(onCommit).toHaveBeenCalledWith(25);
  });

  it('commits empty string when allowEmpty is true and input is cleared', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: 10, onCommit, allowEmpty: true }),
    );

    act(() => {
      result.current.onFocus({
        target: { select: vi.fn() },
      } as unknown as React.FocusEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onBlur();
    });

    expect(onCommit).toHaveBeenCalledWith('');
  });

  it('commits 0 when allowEmpty is false and input is cleared', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: 10, onCommit, allowEmpty: false }),
    );

    act(() => {
      result.current.onFocus({
        target: { select: vi.fn() },
      } as unknown as React.FocusEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onBlur();
    });

    expect(onCommit).toHaveBeenCalledWith(0);
  });

  it('uses fallbackValue when incrementing from empty', () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() =>
      useNumericInput({ value: '', onCommit, fallbackValue: 16 }),
    );

    act(() => {
      result.current.onKeyDown(createKeyboardEvent('ArrowUp'));
    });

    expect(onCommit).toHaveBeenCalledWith(17);
  });

  it('syncs displayValue from external value changes when not focused', () => {
    const onCommit = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useNumericInput({ value, onCommit }),
      { initialProps: { value: 10 as string | number } },
    );

    expect(result.current.displayValue).toBe('10');

    rerender({ value: 20 });

    expect(result.current.displayValue).toBe('20');
  });
});
