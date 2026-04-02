import { SUPPORTED_CSS_PROPERTIES } from '../../../plugins/email-theming/themes';
import { NumberInput } from '../components/number-input';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import { TEXT_DECORATION_ITEMS } from '../config/text-config';
import { ColorInput, Label, Select, ToggleGroup } from '../primitives';

interface TextSectionProps {
  styleObject: Record<string, string | number | undefined>;
  onChange: (prop: string, value: string | number) => void;
  isCollapsed: boolean;
  onAdd: () => void;
  onRemove?: () => void;
  title?: string | false;
  presetColors?: string[];
}

export function TextSection({
  styleObject,
  onChange,
  isCollapsed,
  onAdd,
  onRemove,
  title = 'Typography',
  presetColors,
}: TextSectionProps) {
  return (
    <Section
      title={title}
      isCollapsed={isCollapsed}
      onAdd={onAdd}
      onRemove={onRemove}
    >
      <PropRow>
        <Label>Color</Label>
        <ColorInput
          defaultValue={
            (styleObject.color as string) ??
            String(SUPPORTED_CSS_PROPERTIES.color.defaultValue)
          }
          onChange={(value) => onChange('color', value)}
          onClear={() => onChange('color', '')}
          presetColors={presetColors}
        />
      </PropRow>

      <PropRow>
        <Label>Size</Label>
        <NumberInput
          value={styleObject.fontSize ?? ''}
          onChange={(value) => onChange('fontSize', value)}
          placeholder={String(SUPPORTED_CSS_PROPERTIES.fontSize.defaultValue)}
          unit="px"
          min={0}
        />
      </PropRow>

      <PropRow>
        <Label>Weight</Label>
        <Select.Root
          value={String(
            styleObject.fontWeight ??
              SUPPORTED_CSS_PROPERTIES.fontWeight.defaultValue,
          )}
          onValueChange={(value) => onChange('fontWeight', value)}
        >
          <Select.Trigger className="py-[0.85rem]" size="1">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="300">Light</Select.Item>
            <Select.Item value="400">Regular</Select.Item>
            <Select.Item value="600">Semi Bold</Select.Item>
            <Select.Item value="700">Bold</Select.Item>
            <Select.Item value="800">Extra Bold</Select.Item>
          </Select.Content>
        </Select.Root>
      </PropRow>

      <PropRow>
        <Label>Height</Label>
        <NumberInput
          value={styleObject.lineHeight ?? ''}
          onChange={(value) => onChange('lineHeight', value)}
          placeholder={String(SUPPORTED_CSS_PROPERTIES.lineHeight.defaultValue)}
          unit="%"
        />
      </PropRow>

      <PropRow>
        <Label>Decoration</Label>
        <ToggleGroup.Root
          value={
            (styleObject.textDecoration as string) ??
            String(SUPPORTED_CSS_PROPERTIES.textDecoration.defaultValue)
          }
          onValueChange={(value) => {
            if (!Array.isArray(value)) {
              onChange('textDecoration', value);
            }
          }}
        >
          {TEXT_DECORATION_ITEMS.map((item) => (
            <ToggleGroup.Item
              key={item.value}
              value={item.value}
              aria-label={item.label}
            >
              {item.icon}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </PropRow>
    </Section>
  );
}
