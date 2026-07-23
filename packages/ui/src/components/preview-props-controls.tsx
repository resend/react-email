'use client';

import * as Switch from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '../utils';
import type { DeclaredPreviewControls } from '../utils/preview-controls/declared-preview-controls';
import {
  type ControlDescriptor,
  resolvePreviewControls,
} from '../utils/preview-controls/resolve-preview-controls';
import { unreachable } from '../utils/unreachable';
import { FieldLabel, SelectInput, TextInput } from './field';
import { JsonEditor } from './json-editor';

interface PreviewPropsControlsProps {
  previewProps: Record<string, unknown>;
  declaredControls: DeclaredPreviewControls | undefined;
  disabled?: boolean;
  onChangeProp: (key: string, value: unknown) => void;
}

/**
 * A form of per-prop controls as an alternative to editing the raw JSON:
 * the template's `PreviewControls` declaration first, then controls inferred
 * from the remaining props. Value edits are reported per key so the editor
 * can merge them into a single props override.
 */
export const PreviewPropsControls = ({
  previewProps,
  declaredControls,
  disabled = false,
  onChangeProp,
}: PreviewPropsControlsProps) => {
  const controls = resolvePreviewControls(previewProps, declaredControls);

  if (controls.length === 0) {
    return (
      <p className="text-slate-11">
        This template has no preview props. Export a{' '}
        <code className="text-slate-12">PreviewProps</code> object from it to
        control the preview here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {controls.map((control) => (
        <PropField
          control={control}
          disabled={disabled}
          key={control.key}
          onChange={(value) => {
            onChangeProp(control.key, value);
          }}
          value={previewProps[control.key]}
        />
      ))}
    </div>
  );
};

interface ControlProps<Value> {
  id: string;
  value: Value;
  disabled: boolean;
  onChange: (value: Value) => void;
}

const PropField = ({
  control,
  value,
  disabled,
  onChange,
}: {
  control: ControlDescriptor;
  value: unknown;
  disabled: boolean;
  onChange: (value: unknown) => void;
}) => {
  const id = React.useId();

  // A control's declared type wins over the value's runtime type (the value
  // may not match after a raw JSON edit, or not exist at all), so each field
  // coerces the value into what it can render.
  let field: React.ReactNode;
  switch (control.type) {
    case 'boolean':
      field = (
        <BooleanControl
          disabled={disabled}
          id={id}
          onChange={onChange}
          value={value === true}
        />
      );
      break;
    case 'number':
      field = (
        <NumberControl
          disabled={disabled}
          id={id}
          max={control.max}
          min={control.min}
          onChange={onChange}
          step={control.step}
          value={
            typeof value === 'number' && Number.isFinite(value)
              ? value
              : undefined
          }
        />
      );
      break;
    case 'text':
      field = (
        <TextControl
          disabled={disabled}
          id={id}
          onChange={onChange}
          value={typeof value === 'string' ? value : ''}
        />
      );
      break;
    case 'select':
      field = (
        <SelectControl
          disabled={disabled}
          id={id}
          onChange={onChange}
          options={control.options}
          value={value}
        />
      );
      break;
    case 'json':
      field = (
        <JsonControl
          disabled={disabled}
          id={id}
          onChange={onChange}
          value={value}
        />
      );
      break;
    default:
      field = unreachable(control);
  }

  return (
    <div>
      <FieldLabel className="mb-1" htmlFor={id}>
        {control.label}
      </FieldLabel>
      {field}
    </div>
  );
};

const BooleanControl = ({
  id,
  value,
  disabled,
  onChange,
}: ControlProps<boolean>) => (
  <Switch.Root
    checked={value}
    className={cn(
      'inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-slate-6 transition duration-200 ease-in-out',
      'data-[state=checked]:bg-slate-9 data-[state=unchecked]:bg-slate-4',
      disabled ? 'opacity-60' : 'hover:border-slate-8',
    )}
    disabled={disabled}
    id={id}
    onCheckedChange={onChange}
  >
    <Switch.Thumb
      className={cn(
        'block h-3.5 w-3.5 rounded-full bg-slate-12 transition-transform duration-150',
        'translate-x-0.75 data-[state=checked]:translate-x-4.5',
      )}
    />
  </Switch.Root>
);

const SelectControl = ({
  id,
  value,
  options,
  disabled,
  onChange,
}: ControlProps<unknown> & { options: (string | number)[] }) => {
  // Options are indexed rather than stringified so numeric options keep
  // their type through the round-trip.
  const selectedIndex = options.indexOf(value as string | number);

  return (
    <SelectInput
      disabled={disabled}
      id={id}
      onChange={(event) => {
        const option = options[Number(event.currentTarget.value)];
        if (option !== undefined) {
          onChange(option);
        }
      }}
      value={selectedIndex === -1 ? '' : String(selectedIndex)}
    >
      {selectedIndex === -1 ? (
        // The current value (e.g. from a raw JSON edit) is not among the
        // options; represent it with an empty placeholder instead of
        // pretending an option is selected.
        <option disabled value="" />
      ) : null}
      {options.map((option, index) => (
        <option key={option} value={String(index)}>
          {option}
        </option>
      ))}
    </SelectInput>
  );
};

/**
 * Text-like controls keep a local draft while focused so the input does not
 * snap back to the last applied value mid-typing; the draft re-syncs from the
 * applied props once the field loses focus (e.g. after a reset).
 */
const useFieldDraft = <Element extends HTMLElement>(
  appliedText: string,
  ref: React.RefObject<Element | null>,
) => {
  const [draft, setDraft] = React.useState(appliedText);

  React.useEffect(() => {
    if (document.activeElement !== ref.current) {
      setDraft(appliedText);
    }
  }, [appliedText, ref]);

  return [draft, setDraft] as const;
};

const TextControl = ({
  id,
  value,
  disabled,
  onChange,
}: ControlProps<string>) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useFieldDraft(value, ref);

  return (
    <TextInput
      disabled={disabled}
      id={id}
      onChange={(event) => {
        setDraft(event.currentTarget.value);
        onChange(event.currentTarget.value);
      }}
      ref={ref}
      spellCheck={false}
      type="text"
      value={draft}
    />
  );
};

const NumberControl = ({
  id,
  value,
  disabled,
  min,
  max,
  step,
  onChange,
}: ControlProps<number | undefined> & {
  min?: number;
  max?: number;
  step?: number;
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useFieldDraft(
    value === undefined ? '' : String(value),
    ref,
  );

  return (
    <TextInput
      disabled={disabled}
      id={id}
      max={max}
      min={min}
      onChange={(event) => {
        const text = event.currentTarget.value;
        setDraft(text);
        const parsed = Number(text);
        if (text.trim() !== '' && Number.isFinite(parsed)) {
          onChange(parsed);
        }
      }}
      ref={ref}
      step={step}
      type="number"
      value={draft}
    />
  );
};

const isParseableJson = (text: string) => {
  try {
    JSON.parse(text);
    return true;
  } catch (_exception) {
    return false;
  }
};

const JsonControl = ({
  id,
  value,
  disabled,
  onChange,
}: ControlProps<unknown>) => {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useFieldDraft(
    JSON.stringify(value ?? null, null, 2),
    ref,
  );
  const invalid = !isParseableJson(draft);

  return (
    <JsonEditor
      aria-invalid={invalid}
      className={cn(
        'min-h-20',
        invalid && 'border-red-9 focus-within:border-red-9',
      )}
      disabled={disabled}
      id={id}
      onChange={(text) => {
        setDraft(text);
        try {
          onChange(JSON.parse(text) as unknown);
        } catch (_exception) {
          // Half-typed JSON stays local until it parses again.
        }
      }}
      textareaRef={ref}
      value={draft}
    />
  );
};
