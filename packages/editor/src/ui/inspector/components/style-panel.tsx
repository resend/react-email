import { ALIGNMENT_ITEMS } from '../config/text-config';

type SectionId =
  | 'alignment'
  | 'text'
  | 'size'
  | 'padding'
  | 'background'
  | 'border'
  | 'link'
  | 'otherStyles';

import { ToggleGroup } from '../primitives';
import { BackgroundSection } from '../sections/background';
import { BorderSection } from '../sections/border';
import { PaddingSection } from '../sections/padding';
import { SizeSection } from '../sections/size';
import { TextSection } from '../sections/text';
import { Section } from './section';

interface StylePanelProps {
  title: string;
  styleObject: Record<string, string | number | undefined>;
  sections: SectionId[];
  onChange: (prop: string, value: string | number) => void;
  onBatchChange?: (changes: [prop: string, value: string | number][]) => void;
  onPaddingChange: (values: Record<string, number>) => void;
  showSectionTitles?: boolean;
  presetColors?: string[];
}

export function StylePanel({
  title,
  styleObject,
  sections,
  onChange,
  onBatchChange,
  onPaddingChange,
  showSectionTitles = true,
  presetColors,
}: StylePanelProps) {
  if (sections.length === 0) {
    return null;
  }

  const alignmentValue =
    (styleObject.align as string) ||
    (styleObject.alignment as string) ||
    'left';

  const sectionTitle = (label: string) => (showSectionTitles ? label : false);

  return (
    <>
      {sections.includes('alignment') && (
        <Section title={sectionTitle(title)}>
          <ToggleGroup.Root
            value={alignmentValue}
            onValueChange={(value) => {
              if (!Array.isArray(value)) {
                onChange('align', value);
              }
            }}
            className="w-full"
          >
            {ALIGNMENT_ITEMS.map((item) => (
              <ToggleGroup.Item
                className="flex-1"
                key={item.value}
                value={item.value}
              >
                {item.icon}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </Section>
      )}

      {sections.includes('background') && (
        <BackgroundSection
          title={sectionTitle('Background')}
          backgroundColor={(styleObject.backgroundColor as string) ?? ''}
          onChange={onChange}
          isCollapsed={false}
          onAdd={() => {}}
          presetColors={presetColors}
        />
      )}

      {sections.includes('size') && (
        <SizeSection
          title={sectionTitle('Size')}
          styleObject={styleObject}
          onChange={onChange}
          isCollapsed={false}
          onAdd={() => {}}
        />
      )}

      {sections.includes('text') && (
        <TextSection
          title={sectionTitle('Typography')}
          styleObject={styleObject}
          onChange={onChange}
          isCollapsed={false}
          onAdd={() => {}}
          presetColors={presetColors}
        />
      )}

      {sections.includes('padding') && (
        <PaddingSection
          title={sectionTitle('Spacing')}
          styleObject={styleObject}
          onChange={onPaddingChange}
          isCollapsed={false}
          onAdd={() => {}}
        />
      )}

      {sections.includes('border') && (
        <BorderSection
          title={sectionTitle('Border')}
          styleObject={styleObject}
          onChange={(propOrChanges, value) => {
            if (Array.isArray(propOrChanges)) {
              if (onBatchChange) {
                onBatchChange(propOrChanges);
              } else {
                for (const [p, v] of propOrChanges) {
                  onChange(p, v);
                }
              }
            } else {
              onChange(propOrChanges, value!);
            }
          }}
          isCollapsed={false}
          onAdd={() => {}}
          presetColors={presetColors}
        />
      )}
    </>
  );
}
