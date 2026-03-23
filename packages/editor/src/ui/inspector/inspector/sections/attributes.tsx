import { Label } from '@/ui/label';
import * as Select from '@/ui/select';
import { Textarea } from '@/ui/textarea';
import { NumberInput } from '../components/number-input';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import { TextInput } from '../components/text-input';
import type { AttributeInput } from '../utils/parse-attributes';

interface AttributesSectionProps {
  inputs: AttributeInput[];
  onChange: (prop: string, value: string | number) => void;
}

export function AttributesSection({
  inputs,
  onChange,
}: AttributesSectionProps) {
  if (inputs.length === 0) {
    return null;
  }

  return (
    <Section title="Attributes">
      {inputs.map((input) => (
        <PropRow key={input.prop}>
          <Label title={input.label} className="truncate" htmlFor={input.prop}>
            {input.label}
          </Label>
          {renderInput(input, onChange)}
        </PropRow>
      ))}
    </Section>
  );
}

function renderInput(
  input: AttributeInput,
  onChange: (prop: string, value: string | number) => void,
) {
  if (input.type === 'select' && input.options) {
    return (
      <Select.Root
        value={String(input.value ?? '')}
        onValueChange={(newValue) => onChange(input.prop, newValue)}
      >
        <Select.Trigger className="py-[0.85rem]" size="1">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {Object.entries(input.options)
            .filter(([_, label]) => typeof label === 'string')
            .map(([key, label]) => (
              <Select.Item key={key} className="h-9" value={key}>
                {label as string}
              </Select.Item>
            ))}
        </Select.Content>
      </Select.Root>
    );
  }

  if (input.type === 'number') {
    return (
      <NumberInput
        value={input.value ?? ''}
        onChange={(value) => onChange(input.prop, value)}
        placeholder={input.placeholder}
        unit={input.unit}
      />
    );
  }

  if (input.type === 'textarea') {
    return (
      <Textarea
        className="h-[100px] max-h-[200px] px-1.5 py-1 resize-y text-xs"
        value={String(input.value ?? '')}
        onChange={(e) => onChange(input.prop, e.target.value)}
        placeholder={input.placeholder}
      />
    );
  }

  // Default: text input
  return (
    <TextInput
      placeholder={input.placeholder}
      enableVariables={!!input.options?.enableVariables}
      value={input.value ?? ''}
      onChange={(newValue) => onChange(input.prop, newValue)}
    />
  );
}
