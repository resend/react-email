import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import type { Controls } from '../package';
import { IconArrowDown } from './icons/icon-arrow-down';
import { IconCheck } from './icons/icon-check';

interface PreviewPropControls {
  previewProps: Record<string, unknown>;
  onValueChange: (key: string, newValue: unknown) => void;
  controls: Controls;
}

export const PreviewPropControls = ({
  previewProps,
  onValueChange,
  controls,
}: PreviewPropControls) => {
  return (
    <div className="fixed px-3 py-2 border-t border-solid border-t-slate-9 left-0 bottom-0 bg-black w-full grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-40">
      {Object.entries(controls).map(([key, control]) => {
        if (control) {
          const fieldId = `${key}-${control.type}`;
          const value = previewProps[key];

          switch (control.type) {
            case 'text':
            case 'email':
            case 'number':
              return (
                <div key={fieldId}>
                  <label
                    className="text-slate-10 text-sm mb-2 block"
                    htmlFor={fieldId}
                  >
                    {key}
                  </label>
                  <input
                    className="appearance-none rounded-lg px-2 py-1 mb-3 outline-none w-full bg-slate-3 border placeholder-slate-10 border-slate-6 text-slate-12 text-sm focus:ring-1 focus:ring-slate-10 transition duration-300 ease-in-out"
                    data-1p-ignore
                    id={fieldId}
                    onChange={(event) => {
                      onValueChange(key, event.currentTarget.value);
                    }}
                    type={control.type}
                    value={value as string}
                  />
                </div>
              );
            case 'select':
              return (
                <div key={fieldId}>
                  <label
                    className="text-slate-10 text-sm mb-2 block"
                    htmlFor={fieldId}
                  >
                    {key}
                  </label>
                  <Select.Root
                    onValueChange={(newValue) => {
                      onValueChange(key, newValue);
                    }}
                    value={value as string}
                  >
                    <Select.Trigger
                      className="flex rounded-lg px-2 py-1 mb-3 outline-none w-full bg-slate-3 border placeholder-slate-10 border-slate-6 text-slate-12 text-sm focus:ring-1 focus:ring-slate-10 transition duration-300 ease-in-out"
                      id={fieldId}
                    >
                      <Select.Value />
                      <Select.Icon className="ml-auto">
                        <IconArrowDown />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content
                        className="bg-[#0d0f0f] px-2 py-1 text-slate-12 rounded-lg border border-solid border-slate-6 text-sm"
                        position="item-aligned"
                      >
                        <Select.Viewport>
                          {control.options.map((option) => (
                            <Select.Item
                              className="flex relative items-center select-none rounded-md data-[highlighted]:bg-slate-3 data-[highlighted]:outline-none h-6 pl-6 pr-9"
                              key={option.name}
                              value={option.value as string}
                            >
                              <Select.ItemText>{option.name}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-0 flex items-center justify-center">
                                <IconCheck />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              );
            case 'checkbox':
              return (
                <div key={fieldId}>
                  <Checkbox.Root
                    checked={value as boolean}
                    id={fieldId}
                    onCheckedChange={(newValue) => {
                      onValueChange(key, newValue);
                    }}
                  >
                    <Checkbox.Indicator>
                      <IconCheck />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    className="text-slate-10 text-sm mb-2 block"
                    htmlFor={fieldId}
                  >
                    {key}
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
