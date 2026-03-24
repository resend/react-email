import * as React from 'react';

interface UseDragToChangeOptions {
  value: string | number | undefined | null;
  onCommit: (value: number | '') => void;
  min?: number;
  step?: number;
}

export function useDragToChange({
  value,
  onCommit,
  min,
  step = 1,
}: UseDragToChangeOptions) {
  const startXRef = React.useRef(0);
  const startValueRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);

  React.useEffect(() => {
    return () => {
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };
  }, []);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startValueRef.current = Number(value) || 0;

      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
    },
    [value],
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      const dx = e.clientX - startXRef.current;
      const effectiveStep = e.shiftKey ? step * 10 : step;
      const delta = Math.round(dx / 2) * effectiveStep;
      const next = Math.max(
        min ?? Number.NEGATIVE_INFINITY,
        startValueRef.current + delta,
      );
      onCommit(next);
    },
    [onCommit, min, step],
  );

  const onPointerUp = React.useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
  }, []);

  return {
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style: { cursor: 'ew-resize' } as React.CSSProperties,
    },
  };
}
