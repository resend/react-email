'use client';

import * as colorPicker from '@zag-js/color-picker';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useId, useRef } from 'react';
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
  const id = useId();

  const service = useMachine(colorPicker.machine, {
    id,
    value: colorPicker.parse(value || '#000000'),
    onValueChangeEnd(details) {
      onChange(details.valueAsString);
    },
  });

  const api = colorPicker.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()} data-re-inspector-color-control>
        <button
          type="button"
          {...api.getTriggerProps()}
          data-re-inspector-color-trigger
          style={{ background: api.value.toString('css') }}
        />
        <input
          {...api.getChannelInputProps({ channel: 'hex' })}
          data-re-inspector-color-hex
        />
      </div>

      <div {...api.getPositionerProps()}>
        <div {...api.getContentProps()} data-re-inspector-color-content>
          <div {...api.getAreaProps()} data-re-inspector-color-area>
            <div {...api.getAreaBackgroundProps()} />
            <div {...api.getAreaThumbProps()} />
          </div>
          <div
            {...api.getChannelSliderProps({ channel: 'hue' })}
            data-re-inspector-color-slider
          >
            <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} />
            <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} />
          </div>
          <div
            {...api.getChannelSliderProps({ channel: 'alpha' })}
            data-re-inspector-color-slider
          >
            <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} />
            <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} />
          </div>
        </div>
      </div>
    </div>
  );
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
