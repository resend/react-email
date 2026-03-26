import { NodeSelection } from '@tiptap/pm/state';
import type { useCurrentEditor } from '@tiptap/react';
import { TextQuote } from 'lucide-react';
import { Button } from '@/ui/button';
import { ColorInput } from '@/ui/color-input';
import { Label } from '@/ui/label';
import { ToggleGroup } from '@/ui/toggle-group';
import { setTextAlignment } from '../../../../core/set-text-alignment';
import { SUPPORTED_CSS_PROPERTIES } from '../../../plugins/email-theming/themes';
import { NumberInput } from '../components/number-input';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import {
  ALIGNMENT_ITEMS,
  type EditorSnapshot,
  FORMAT_ITEMS,
  JUSTIFY_AND_LIST_ITEMS,
  MARK_TOGGLES,
  TEXT_TYPE_OPTIONS,
} from '../inspector/config/text-config';
import {
  applyMarkToggles,
  textTypeValue,
  updateParentBlockStyle,
} from '../inspector/utils/text-block-utils';

type Editor = NonNullable<ReturnType<typeof useCurrentEditor>['editor']>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TextTypographySectionProps {
  editor: Editor;
  editorState: EditorSnapshot;
  /** The effective text color (resolved through link / theme fallbacks) */
  effectiveColor: string;
  /** Callback when the text color changes */
  onColorChange: (color: string) => void;
  /** Predefined colors extracted from the document */
  presetColors?: string[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * The rich-text typography section used by `InspectorText`.
 *
 * Contains:
 * - Text type pills (Title, Subtitle, Heading, Body)
 * - Color & font-size & line-height inputs
 * - Format mark toggles (Bold, Italic, Underline, Strikethrough, Code)
 * - Alignment toggle group
 * - Blockquote + justify/list toggle groups
 *
 * This is a pure presentation + handler layer — all editor state is passed
 * in from the parent so the component stays testable and composable.
 */
export function TextTypographySection({
  editor,
  editorState,
  effectiveColor,
  onColorChange,
  presetColors,
}: TextTypographySectionProps) {
  // --- Derived values -----------------------------------------------------

  const activeFormatMarks = MARK_TOGGLES.filter(({ active }) =>
    active(editorState),
  ).map(({ value }) => value);

  const currentTextType = textTypeValue(
    editorState.parentBlock.nodeType,
    (editorState.parentBlock.attrs.level as number) ?? 1,
  );

  const justifyAndListValue: string[] = [];
  if (editorState.parentBlock.alignment === 'justify') {
    justifyAndListValue.push('justify');
  }
  if (editorState.isBulletListActive) {
    justifyAndListValue.push('bulletList');
  }
  if (editorState.isOrderedListActive) {
    justifyAndListValue.push('orderedList');
  }

  const blockquoteValue: string[] = [];
  if (editorState.isBlockquoteActive) {
    blockquoteValue.push('blockquote');
  }

  const parentPos = editorState.parentBlock.pos;
  const blockStyle = editorState.blockStyle as Record<
    string,
    string | number | undefined
  >;

  // --- Handlers -----------------------------------------------------------

  const handleTextTypeChange = (value: string | string[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    const option = TEXT_TYPE_OPTIONS.find((o) => o.value === v);
    if (!option) {
      return;
    }
    if (option.nodeType === 'heading' && 'level' in option) {
      editor
        .chain()
        .focus()
        .setHeading({ level: option.level as 1 | 2 | 3 })
        .run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
    const node = editor.state.doc.nodeAt(parentPos);
    if (node) {
      const tr = editor.state.tr.setNodeMarkup(parentPos, null, {
        ...node.attrs,
        style: '',
      });
      editor.view.dispatch(tr);
    }
  };

  const handleAlignmentChange = (alignment: string | string[]) => {
    const val = Array.isArray(alignment) ? alignment[0] : alignment;
    setTextAlignment(editor, val);
  };

  const handleJustifyOrListChange = (value: string | string[]) => {
    const arr = Array.isArray(value) ? value : [value];
    if (arr.includes('justify')) {
      editor.chain().focus().setAlignment('justify').run();
    } else if (editorState.parentBlock.alignment === 'justify') {
      editor.chain().focus().setAlignment('left').run();
    }
    if (arr.includes('bulletList') && !editorState.isBulletListActive) {
      editor.chain().focus().toggleBulletList().run();
    } else if (!arr.includes('bulletList') && editorState.isBulletListActive) {
      editor.chain().focus().toggleBulletList().run();
    }
    if (arr.includes('orderedList') && !editorState.isOrderedListActive) {
      editor.chain().focus().toggleOrderedList().run();
    } else if (
      !arr.includes('orderedList') &&
      editorState.isOrderedListActive
    ) {
      editor.chain().focus().toggleOrderedList().run();
    }
  };

  const handleBlockquoteChange = (value: string | string[]) => {
    const arr = Array.isArray(value) ? value : [value];
    if (arr.includes('blockquote') !== editorState.isBlockquoteActive) {
      editor.chain().focus().toggleBlockquote().run();
    }
  };

  const handleFormatChange = (marks: string | string[]) => {
    const arr = Array.isArray(marks) ? marks : [marks];
    const { selection } = editor.state;
    const isCollapsed = selection.empty;
    const isNodeSel = selection instanceof NodeSelection;

    // When no text is selected or in node-selection mode, select the entire
    // parent text block so marks apply to all existing content.
    if (isCollapsed || isNodeSel) {
      const blockPos = editorState.parentBlock.pos;
      const node = editor.state.doc.nodeAt(blockPos);

      if (node && node.content.size > 0) {
        const blockFrom = blockPos + 1;
        const blockTo = blockPos + 1 + node.content.size;

        let chain = editor
          .chain()
          .focus()
          .setTextSelection({ from: blockFrom, to: blockTo });

        chain = applyMarkToggles(chain, arr, editorState);

        // Restore the original selection type
        if (isNodeSel) {
          chain.setNodeSelection(blockPos).run();
        } else {
          chain.setTextSelection(selection.from).run();
        }
        return;
      }
    }

    // Text is selected — apply marks only to the selection
    let chain = editor.chain().focus();
    chain = applyMarkToggles(chain, arr, editorState);
    chain.run();
  };

  const handleBlockStyleChange = (prop: string, value: string | number) => {
    updateParentBlockStyle(editor, parentPos, prop, value);
  };

  // --- Render -------------------------------------------------------------

  return (
    <>
      {/* Text type pills */}
      <div className="grid grid-cols-3 gap-2">
        {TEXT_TYPE_OPTIONS.map((opt) => {
          const isSelected = currentTextType === opt.value;
          return (
            <Button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              aria-label={opt.label}
              appearance="gray"
              size="2"
              onClick={() => handleTextTypeChange(opt.value)}
              className="border-gray-a1 aria-pressed:text-gray-10 aria-pressed:bg-gray-a3 dark:aria-pressed:bg-gray-a4 aria-pressed:border-gray-a3"
            >
              {opt.label}
            </Button>
          );
        })}
      </div>

      {/* Typography section */}
      <Section title="Typography">
        <PropRow>
          <Label>Color</Label>
          <ColorInput
            defaultValue={effectiveColor}
            onChange={onColorChange}
            onClear={() => onColorChange('')}
            presetColors={presetColors}
          />
        </PropRow>
        <PropRow>
          <Label>Font size</Label>
          <NumberInput
            value={blockStyle.fontSize ?? ''}
            onChange={(v) =>
              handleBlockStyleChange('fontSize', v === '' ? '' : Number(v))
            }
            placeholder={String(SUPPORTED_CSS_PROPERTIES.fontSize.defaultValue)}
            unit="px"
            min={0}
          />
        </PropRow>
        <PropRow>
          <Label>Line height</Label>
          <NumberInput
            value={blockStyle.lineHeight ?? ''}
            onChange={(v) =>
              handleBlockStyleChange('lineHeight', v === '' ? '' : Number(v))
            }
            placeholder={String(
              SUPPORTED_CSS_PROPERTIES.lineHeight.defaultValue,
            )}
            unit="%"
          />
        </PropRow>

        <PropRow>
          <ToggleGroup.Root
            value={activeFormatMarks}
            onValueChange={handleFormatChange}
            className="inline-flex justify-between w-full gap-2 p-1"
          >
            {FORMAT_ITEMS.map((item) => (
              <ToggleGroup.Item
                key={item.value}
                value={item.value}
                className="shrink-0"
                aria-label={item.label}
                tooltip={item.label}
              >
                {item.icon}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </PropRow>

        <PropRow>
          <ToggleGroup.Root
            value={editorState.parentBlock.alignment}
            onValueChange={handleAlignmentChange}
            className="w-full"
          >
            {ALIGNMENT_ITEMS.map((item) => (
              <ToggleGroup.Item
                key={item.value}
                value={item.value}
                className="flex-1"
                aria-label={`Align ${item.value}`}
                tooltip={`Align ${item.value}`}
              >
                {item.alternativeIcon}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </PropRow>

        <PropRow className="gap-2">
          <ToggleGroup.Root
            value={blockquoteValue}
            onValueChange={handleBlockquoteChange}
            className="w-1/3"
          >
            <ToggleGroup.Item
              className="flex-1"
              aria-label="Blockquote"
              value="blockquote"
              tooltip="Blockquote"
            >
              <TextQuote className="size-4" />
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <ToggleGroup.Root
            value={justifyAndListValue}
            onValueChange={handleJustifyOrListChange}
            className="w-full"
          >
            {JUSTIFY_AND_LIST_ITEMS.map((item) => (
              <ToggleGroup.Item
                key={item.value}
                value={item.value}
                className="flex-1"
                aria-label={item.label}
                tooltip={item.label}
              >
                {item.icon}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </PropRow>
      </Section>
    </>
  );
}
