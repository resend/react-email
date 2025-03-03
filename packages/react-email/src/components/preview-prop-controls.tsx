import * as Checkbox from '@radix-ui/react-checkbox';
import type { ComponentProps } from 'react';
import type { Control } from '../actions/get-email-controls';
import { cn } from '../utils';
import { IconCheck } from './icons/icon-check';

type PreviewPropControls = {
  previewProps: Record<string, unknown>;
  onValueChange: (key: string, newValue: unknown) => void;
  controls: Control[];
} & Omit<ComponentProps<'div'>, 'children'>;

export const PreviewPropControls = ({
  previewProps,
  onValueChange,
  controls,
  className,
  ...props
}: PreviewPropControls) => {
  return (
    <div
      {...props}
      className={cn(
        'grid h-40 w-full grid-cols-1 gap-3 border-t border-t-slate-9 border-solid bg-black px-3 py-2 md:grid-cols-3 lg:grid-cols-4',
        className,
      )}
    >
      {controls.map((control) => {
        if (control) {
          const fieldId = `${control.key}-${control.type}`;
          const value = previewProps[control.key];

          switch (control.type) {
            case 'text':
            case 'email':
            case 'number':
              return (
                <div key={fieldId}>
                  <label
                    className="mb-2 block text-slate-10 text-sm"
                    htmlFor={fieldId}
                  >
                    {control.key}
                  </label>
                  <input
                    className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-slate-12 text-sm placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
                    data-1p-ignore
                    id={fieldId}
                    onChange={(event) => {
                      onValueChange(control.key, event.currentTarget.value);
                    }}
                    type={control.type}
                    value={value as string}
                  />
                </div>
              );
            case 'checkbox':
              return (
                <div key={fieldId}>
                  <Checkbox.Root
                    checked={value as boolean}
                    id={fieldId}
                    onCheckedChange={(newValue) => {
                      onValueChange(control.key, newValue);
                    }}
                  >
                    <Checkbox.Indicator>
                      <IconCheck />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    className="mb-2 block text-slate-10 text-sm"
                    htmlFor={fieldId}
                  >
                    {control.key}
                  </label>
                </div>
              );
          }
        }
        return null;
      })}
    </div>
  );
};
