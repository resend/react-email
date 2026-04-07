import type * as React from 'react';
import { normalizeHex } from '../utils/is-valid-hex-color';

export interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorInput({ value, onChange, className }: ColorInputProps) {
  return (
    <span data-re-inspector-color-control="" className={className}>
      <input
        type="color"
        data-re-inspector-color-trigger=""
        value={normalizeHex(value)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
      <input
        type="text"
        data-re-inspector-color-hex=""
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
    </span>
  );
}
