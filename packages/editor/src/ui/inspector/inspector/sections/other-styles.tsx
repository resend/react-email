import { Label } from '@/ui/label';
import { NumberInput } from '../components/number-input';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import { TextInput } from '../components/text-input';
import {
  type AttributeInput,
  getOtherStyles,
  parseOtherStyleToInput,
} from '../utils/parse-attributes';

interface OtherStylesSectionProps {
  styleObject: Record<string, string | number>;
  onChange: (prop: string, value: string | number) => void;
}

export function OtherStylesSection({
  styleObject,
  onChange,
}: OtherStylesSectionProps) {
  const otherStyles = getOtherStyles(styleObject);
  const otherStyleEntries = Object.entries(otherStyles);

  if (otherStyleEntries.length === 0) {
    return null;
  }

  return (
    <Section title="Styles">
      {otherStyleEntries.map(([prop, value]) => {
        const input = parseOtherStyleToInput(prop, value);
        return (
          <PropRow key={prop}>
            <Label title={input.label} className="truncate">
              {input.label}
            </Label>
            {renderInput(input, (p, newValue) => {
              // For number inputs, append the detected unit back
              if (input.type === 'number' && input.detectedUnit) {
                onChange(p, `${newValue}${input.detectedUnit}`);
              } else {
                onChange(p, newValue);
              }
            })}
          </PropRow>
        );
      })}
    </Section>
  );
}

function renderInput(
  input: AttributeInput,
  onChange: (prop: string, value: string | number) => void,
) {
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

  // Default: text input
  return (
    <TextInput
      placeholder={input.placeholder}
      value={input.value ?? ''}
      onChange={(newValue) => onChange(input.prop, newValue)}
    />
  );
}
