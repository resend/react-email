'use client';

import { useRef } from 'react';
import type { PanelInputWithHandler } from './hooks/use-inspector-fields';

export function DefaultField(field: PanelInputWithHandler) {
  return (
    <div data-re-inspector-field>
      <label title={field.label} htmlFor={field.prop}>
        {field.label}
      </label>
      {renderFieldInput(field)}
    </div>
  );
}

function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  // Normalize to 6-digit hex for <input type="color"> (requires #rrggbb)
  const normalizedValue = normalizeHex(value);

  return (
    <span data-re-inspector-color-control>
      <input
        type="color"
        value={normalizedValue}
        onChange={(e) => onChange(e.target.value)}
        data-re-inspector-color-trigger
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-re-inspector-color-hex
      />
    </span>
  );
}

function normalizeHex(value: string): string {
  if (!value) return '#000000';
  const v = value.trim();
  // Expand 3-digit hex to 6-digit: #abc -> #aabbcc
  const shortHex = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
  if (shortHex) {
    return `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}`;
  }
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  return '#000000';
}

function NumberField({
  value,
  onChange,
  placeholder,
  unit,
}: {
  value: string | number;
  onChange: (value: number | '') => void;
  placeholder?: string;
  unit?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    const num = Number.parseFloat(raw);
    if (!Number.isNaN(num)) {
      onChange(num);
    }
  }

  return (
    <span data-re-inspector-number>
      <input
        ref={inputRef}
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        data-re-inspector-input
        data-type="number"
      />
      {unit && <span data-re-inspector-unit>{unit}</span>}
    </span>
  );
}

function renderFieldInput(field: PanelInputWithHandler) {
  switch (field.type) {
    case 'number':
      return (
        <NumberField
          value={field.value}
          onChange={(value) => field.onChange(value)}
          placeholder={field.placeholder}
          unit={field.unit}
        />
      );

    case 'color':
      return (
        <ColorField
          value={String(field.value ?? '')}
          onChange={(color) => field.onChange(color)}
        />
      );

    case 'select':
      return (
        <select
          value={String(field.value ?? '')}
          onChange={(e) => field.onChange(e.target.value)}
          data-re-inspector-select
        >
          {field.options &&
            Object.entries(field.options).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
        </select>
      );

    case 'textarea':
      return (
        <textarea
          value={String(field.value ?? '')}
          onChange={(e) => field.onChange(e.target.value)}
          placeholder={field.placeholder}
          data-re-inspector-input
          data-type="textarea"
        />
      );

    default:
      return (
        <input
          type="text"
          placeholder={field.placeholder}
          value={String(field.value ?? '')}
          onChange={(e) => field.onChange(e.target.value)}
          data-re-inspector-input
        />
      );
  }
}
