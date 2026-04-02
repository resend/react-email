import * as React from 'react';

interface UseNumericInputOptions {
  value: string | number | undefined | null;
  onCommit: (value: number | '') => void;
  allowEmpty?: boolean;
  min?: number;
  fallbackValue?: number;
}

interface UseNumericInputReturn {
  displayValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function toDisplayString(v: string | number | undefined | null): string {
  if (v === '' || v === undefined || v === null || Number.isNaN(v)) {
    return '';
  }
  return String(v);
}

export function useNumericInput({
  value,
  onCommit,
  allowEmpty = true,
  min,
  fallbackValue,
}: UseNumericInputOptions): UseNumericInputReturn {
  const [displayValue, setDisplayValue] = React.useState(() =>
    toDisplayString(value),
  );
  const isFocusedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isFocusedRef.current) {
      setDisplayValue(toDisplayString(value));
    }
  }, [value]);

  const commit = React.useCallback(
    (raw: string) => {
      const trimmed = raw.trim();

      if (trimmed === '') {
        if (allowEmpty) {
          onCommit('');
        } else {
          setDisplayValue('0');
          onCommit(0);
        }
        return;
      }

      const num = Number(trimmed);

      if (Number.isNaN(num)) {
        setDisplayValue(toDisplayString(value));
        return;
      }

      const clamped = Math.max(num, min ?? Number.NEGATIVE_INFINITY);
      setDisplayValue(String(clamped));
      onCommit(clamped);
    },
    [value, onCommit, allowEmpty, min],
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayValue(e.target.value);
    },
    [],
  );

  const onBlur = React.useCallback(() => {
    isFocusedRef.current = false;
    commit(displayValue);
  }, [commit, displayValue]);

  const onFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    e.target.select();
  }, []);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        commit(displayValue);
        (e.target as HTMLInputElement).blur();
      }

      if (e.key === 'Escape') {
        setDisplayValue(toDisplayString(value));
        isFocusedRef.current = false;
        (e.target as HTMLInputElement).blur();
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const current = Number(displayValue) || fallbackValue || 0;
        const next = Math.max(
          min ?? Number.NEGATIVE_INFINITY,
          e.key === 'ArrowUp' ? current + step : current - step,
        );
        setDisplayValue(String(next));
        onCommit(next);
      }
    },
    [commit, displayValue, value, onCommit, min, fallbackValue],
  );

  return { displayValue, onChange, onBlur, onFocus, onKeyDown };
}
