import type { Attrs } from '@tiptap/pm/model';
import * as React from 'react';
import { Label } from '@/ui/label';
import * as Select from '@/ui/select';
import { TextField } from '@/ui/text-field';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import { useNumericInput } from '../components/use-numeric-input';

type SizeUnit = 'px' | '%';

interface SizeSectionProps {
  /** Section heading. When omitted, defaults to "Size". Pass `undefined` to hide. */
  title?: string | false;
  /** HTML attributes (for elements like img where width/height are attrs) */
  attrs?: Attrs;
  /** CSS styles (for elements like button where width/height are styles) */
  styleObject?: Record<string, string | number | undefined>;
  onChange: (prop: string, value: string | number) => void;
  isCollapsed: boolean;
  onAdd: () => void;
  onRemove?: () => void;
}

function parseValueAndUnit(raw: string | number | undefined): {
  value: number | '';
  unit: SizeUnit;
} {
  if (raw === '' || raw === undefined || raw === null) {
    return { value: '', unit: 'px' };
  }
  const str = String(raw);
  if (str.endsWith('%')) {
    const num = Number.parseFloat(str);
    return { value: Number.isNaN(num) ? '' : num, unit: '%' };
  }
  const num = Number.parseFloat(str);
  return { value: Number.isNaN(num) ? '' : num, unit: 'px' };
}

function formatValue(num: number | '', unit: SizeUnit): string | number {
  if (num === '') {
    return '';
  }
  return unit === '%' ? `${num}%` : num;
}

export function SizeSection({
  title = 'Size',
  attrs = {},
  styleObject,
  onChange,
  isCollapsed,
  onAdd,
  onRemove,
}: SizeSectionProps) {
  // Prefer attrs (for images), fallback to styleObject (for buttons)
  const rawWidth = attrs.width ?? styleObject?.width ?? '';
  const rawHeight = attrs.height ?? styleObject?.height ?? '';

  const parsedWidth = parseValueAndUnit(rawWidth);
  const parsedHeight = parseValueAndUnit(rawHeight);

  const [widthUnit, setWidthUnit] = React.useState<SizeUnit>(parsedWidth.unit);
  const [heightUnit, setHeightUnit] = React.useState<SizeUnit>(
    parsedHeight.unit,
  );

  // Sync unit state when external value changes
  React.useEffect(() => {
    setWidthUnit(parsedWidth.unit);
  }, [parsedWidth.unit]);

  React.useEffect(() => {
    setHeightUnit(parsedHeight.unit);
  }, [parsedHeight.unit]);

  const handleWidthUnitChange = (newUnit: string) => {
    const unit = newUnit as SizeUnit;
    if (unit === widthUnit) {
      return;
    }
    setWidthUnit(unit);
    if (parsedWidth.value !== '') {
      onChange('width', formatValue(parsedWidth.value, unit));
    }
  };

  const handleHeightUnitChange = (newUnit: string) => {
    const unit = newUnit as SizeUnit;
    if (unit === heightUnit) {
      return;
    }
    setHeightUnit(unit);
    if (parsedHeight.value !== '') {
      onChange('height', formatValue(parsedHeight.value, unit));
    }
  };

  return (
    <Section
      title={title}
      isCollapsed={isCollapsed}
      onAdd={onAdd}
      onRemove={onRemove}
    >
      <PropRow>
        <Label>Width</Label>
        <div className="flex items-center gap-1">
          <SizeInput
            value={parsedWidth.value}
            onChange={(value) =>
              onChange('width', formatValue(value, widthUnit))
            }
            placeholder="auto"
          />
          <UnitSelect value={widthUnit} onChange={handleWidthUnitChange} />
        </div>
      </PropRow>
      <PropRow>
        <Label>Height</Label>
        <div className="flex items-center gap-1">
          <SizeInput
            value={parsedHeight.value}
            onChange={(value) =>
              onChange('height', formatValue(value, heightUnit))
            }
            placeholder="auto"
          />
          <UnitSelect value={heightUnit} onChange={handleHeightUnitChange} />
        </div>
      </PropRow>
    </Section>
  );
}

function SizeInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
}) {
  const { displayValue, ...handlers } = useNumericInput({
    value,
    onCommit: onChange,
  });

  return (
    <TextField.Root className="min-w-0 flex-1">
      <TextField.Input
        className="p-[0.85rem] font-mono"
        value={displayValue}
        placeholder={placeholder}
        type="text"
        inputMode="numeric"
        {...handlers}
      />
    </TextField.Root>
  );
}

function UnitSelect({
  value,
  onChange,
}: {
  value: SizeUnit;
  onChange: (unit: string) => void;
}) {
  return (
    <div className="w-[72px]">
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger size="2">
          <Select.Value />
        </Select.Trigger>
        <Select.Content align="end">
          <Select.Item value="px">px</Select.Item>
          <Select.Item value="%">%</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
