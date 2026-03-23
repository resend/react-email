import { PaddingPicker } from '../components/padding-picker';
import { Section } from '../components/section';

interface PaddingSectionProps {
  styleObject: Record<string, string | number | undefined>;
  onChange: (values: Record<string, number>) => void;
  isCollapsed: boolean;
  onAdd: () => void;
  onRemove?: () => void;
  title?: string | false;
}

export function PaddingSection({
  styleObject,
  onChange,
  isCollapsed,
  onAdd,
  onRemove,
  title = 'Spacing',
}: PaddingSectionProps) {
  return (
    <Section
      title={title}
      isCollapsed={isCollapsed}
      onAdd={onAdd}
      onRemove={onRemove}
    >
      <PaddingPicker
        value={{
          paddingTop: Number(styleObject.paddingTop) || 0,
          paddingRight: Number(styleObject.paddingRight) || 0,
          paddingBottom: Number(styleObject.paddingBottom) || 0,
          paddingLeft: Number(styleObject.paddingLeft) || 0,
        }}
        onChange={onChange}
      />
    </Section>
  );
}
