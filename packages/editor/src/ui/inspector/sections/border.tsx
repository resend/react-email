import { BorderPicker } from '../components/border-picker';
import { BorderRadiusPicker } from '../components/border-radius-picker';
import { Section } from '../components/section';

export type BatchableChangeFn = (
  propOrChanges: string | [string, string | number][],
  value?: string | number,
) => void;

interface BorderSectionProps {
  styleObject: Record<string, string | number | undefined>;
  onChange: BatchableChangeFn;
  isCollapsed: boolean;
  onAdd: () => void;
  onRemove?: () => void;
  /** Override the section heading. Pass `undefined` to hide it entirely. */
  title?: string | false;
  /** Predefined colors extracted from the document */
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
