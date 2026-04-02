import {
  type BatchableChangeFn,
  BorderPicker,
} from '../components/border-picker';
import { BorderRadiusPicker } from '../components/border-radius-picker';
import { Section } from '../components/section';

export type { BatchableChangeFn };

interface BorderSectionProps {
  styleObject: Record<string, string | number | undefined>;
  onChange: BatchableChangeFn;
  isCollapsed: boolean;
  onAdd: () => void;
  onRemove?: () => void;
  title?: string | false;
  presetColors?: string[];
}

export function BorderSection({
  styleObject,
  onChange,
  isCollapsed,
  onAdd,
  onRemove,
  title = 'Border',
  presetColors,
}: BorderSectionProps) {
  return (
    <Section
      title={title}
      isCollapsed={isCollapsed}
      onAdd={onAdd}
      onRemove={onRemove}
    >
      <BorderRadiusPicker
        value={styleObject.borderRadius ?? 0}
        onChange={(value) => {
          onChange('borderRadius', value);
        }}
      />
      <BorderPicker
        styleObject={styleObject}
        onChange={onChange}
        presetColors={presetColors}
      />
    </Section>
  );
}
