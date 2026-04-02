import { SUPPORTED_CSS_PROPERTIES } from '../../../plugins/email-theming/themes';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import { ColorInput, Label } from '../primitives';

interface BackgroundSectionProps {
  backgroundColor: string;
  onChange: (prop: string, value: string) => void;
  isCollapsed: boolean;
  onAdd: () => void;
  onRemove?: () => void;
  title?: string | false;
  presetColors?: string[];
}

export function BackgroundSection({
  backgroundColor,
  onChange,
  isCollapsed,
  onAdd,
  onRemove,
  title = 'Background',
  presetColors,
}: BackgroundSectionProps) {
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
            backgroundColor ??
            String(SUPPORTED_CSS_PROPERTIES.backgroundColor.defaultValue)
          }
          onChange={(value) => onChange('backgroundColor', value)}
          onClear={() => onChange('backgroundColor', '')}
          presetColors={presetColors}
        />
      </PropRow>
    </Section>
  );
}
