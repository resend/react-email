import { ToggleGroup } from '@/ui/toggle-group';
import type { SectionId } from '../config/node-section-config';
import { ALIGNMENT_ITEMS } from '../config/text-config';
import { BackgroundSection } from '../sections/background';
import { BorderSection } from '../sections/border';
import { PaddingSection } from '../sections/padding';
import { SizeSection } from '../sections/size';
import { TextSection } from '../sections/text';
import { Section } from './section';

interface StylePanelProps {
  /** Panel group title */
  title: string;
  /** Flat CSS-like record built from PanelGroup inputs */
  styleObject: Record<string, string | number | undefined>;
  /** Which sections to display */
  sections: SectionId[];
  /** Called when any property changes */
  onChange: (prop: string, value: string | number) => void;
  /** Batch-apply multiple property changes in a single update */
  onBatchChange?: (changes: [prop: string, value: string | number][]) => void;
  /** Called when padding values change (batched — all 4 sides at once) */
  onPaddingChange: (values: Record<string, number>) => void;
  /** When true, individual section titles (Typography, Padding, etc.) are shown. Defaults to true. */
  showSectionTitles?: boolean;
  /** Document-wide colors for the color picker swatches */
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
      {/* Alignment — rendered inline (not inside a collapsible Section) */}
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

      {/* Background */}
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

      {/* Sizing */}
      {sections.includes('size') && (
        <SizeSection
          title={sectionTitle('Size')}
          styleObject={styleObject}
          onChange={onChange}
          isCollapsed={false}
          onAdd={() => {}}
        />
      )}

      {/* Typography */}
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

      {/* Padding */}
      {sections.includes('padding') && (
        <PaddingSection
          title={sectionTitle('Spacing')}
          styleObject={styleObject}
          onChange={onPaddingChange}
          isCollapsed={false}
          onAdd={() => {}}
        />
      )}

      {/* Border */}
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
