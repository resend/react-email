import { ColorInput } from '@/ui/color-input';
import { Label } from '@/ui/label';
import * as Select from '@/ui/select';
import { Textarea } from '@/ui/textarea';
import { NumberInput } from './components/number-input';
import { PropRow } from './components/prop-row';
import { TextInput } from './components/text-input';
import type { PanelInputWithHandler } from './hooks/use-inspector-fields';

export function DefaultField(field: PanelInputWithHandler) {
  return (
    <PropRow>
      <Label title={field.label} className="truncate" htmlFor={field.prop}>
        {field.label}
      </Label>
      {renderFieldInput(field)}
    </PropRow>
  );
}

function renderFieldInput(field: PanelInputWithHandler) {
  switch (field.type) {
    case 'number':
      return (
        <NumberInput
          value={field.value}
          onChange={(value) => field.onChange(value)}
          placeholder={field.placeholder}
          unit={field.unit as 'px' | '%' | undefined}
        />
      );

    case 'color':
      return (
        <ColorInput
          defaultValue={String(field.value ?? '')}
          onChange={(color: string) => field.onChange(color)}
        />
      );

    case 'select':
      return (
        <Select.Root
          value={String(field.value ?? '')}
          onValueChange={(value: string) => field.onChange(value)}
        >
          <Select.Trigger className="py-[0.85rem]" size="1">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {field.options &&
              Object.entries(field.options).map(([key, label]) => (
                <Select.Item key={key} className="h-9" value={key}>
                  {label}
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Root>
      );

    case 'textarea':
      return (
        <Textarea
          className="h-[100px] max-h-[200px] px-1.5 py-1 resize-y text-xs"
          value={String(field.value ?? '')}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            field.onChange(e.target.value)
          }
          placeholder={field.placeholder}
        />
      );

    default:
      return (
        <TextInput
          placeholder={field.placeholder}
          value={field.value ?? ''}
          onChange={(newValue) => field.onChange(newValue)}
        />
      );
  }
}
