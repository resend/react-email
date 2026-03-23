import { ColorInput } from '@/ui/color-input';
import { Label } from '@/ui/label';
import { SUPPORTED_CSS_PROPERTIES } from '../../../../plugins/email-theming/themes';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';

interface BackgroundSectionProps {
  backgroundColor: string;
  onChange: (prop: string, value: string) => void;
  isCollapsed: boolean;
  onAdd: () => void;
  onRemove?: () => void;
  /** Override the section heading. Pass `undefined` to hide it entirely. */
  title?: string | false;
  /** Predefined colors extracted from the document */
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
