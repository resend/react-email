import { useCurrentEditor } from '@tiptap/react';
import * as React from 'react';
import type { NodeClickedEvent } from '../../../core/types';
import {
  stylesToCss,
  useEmailTheming,
} from '../../../plugins/email-theming/extension';
import type { KnownThemeComponents } from '../../../plugins/email-theming/types';
import {
  expandShorthandProperties,
  inlineCssToJs,
} from '../../../utils/styles';
import { Section } from '../components/section';
import { LOCAL_PROPS_SCHEMA } from '../config/attribute-schema';
import { ALIGNMENT_ITEMS } from '../config/text-config';
import { useDocumentColors } from '../hooks/use-document-colors';
import {
  getLinkColor,
  updateLinkColor,
  useLinkMark,
} from '../hooks/use-link-mark';
import { ToggleGroup } from '../primitives';
import { AttributesSection } from '../sections/attributes';
import { BackgroundSection } from '../sections/background';
import { BorderSection } from '../sections/border';
import { LinkSection } from '../sections/link';
import { OtherStylesSection } from '../sections/other-styles';
import { PaddingSection } from '../sections/padding';
import { SizeSection } from '../sections/size';
import { TextSection } from '../sections/text';
import { parseAttributes } from '../utils/parse-attributes';
import { resolveThemeDefaults } from '../utils/resolve-theme-defaults';
import {
  customUpdateAttributes,
  customUpdateStyles,
} from '../utils/style-updates';
import { InspectorText } from './text';

const SIZE_AS_ATTRIBUTES: string[] = ['image'];

const SECTION_PROPERTIES: Record<string, string[]> = {
  alignment: ['align', 'alignment'],
  text: ['color', 'fontSize', 'fontWeight', 'lineHeight', 'textDecoration'],
  size: ['width', 'height'],
  padding: [
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
  ],
  background: ['backgroundColor'],
  border: ['borderRadius', 'borderWidth', 'borderColor', 'borderStyle'],
  link: ['href'],
};

type SectionId =
  | 'alignment'
  | 'text'
  | 'size'
  | 'padding'
  | 'background'
  | 'border'
  | 'link';

interface NodeLayout {
  attributes: string[];
  sections: SectionId[];
  defaultExpanded: Set<SectionId>;
}

function getNodeLayout(nodeType: string): NodeLayout {
  switch (nodeType) {
    case 'image':
      return {
        attributes: ['src', 'alt'],
        sections: ['alignment', 'size', 'link', 'padding', 'border'],
        defaultExpanded: new Set(['alignment', 'size']),
      };
    case 'button':
      return {
        attributes: [],
        sections: [
          'alignment',
          'link',
          'text',
          'size',
          'padding',
          'border',
          'background',
        ],
        defaultExpanded: new Set(['alignment', 'link', 'text']),
      };
    case 'link':
      return {
        attributes: ['href'],
        sections: ['text', 'border'],
        defaultExpanded: new Set(['text']),
      };
    case 'codeBlock':
      return {
        attributes: ['language', 'theme'],
        sections: ['padding', 'border'],
        defaultExpanded: new Set(),
      };
    case 'section':
    case 'div':
      return {
        attributes: [],
        sections: ['background', 'padding', 'border'],
        defaultExpanded: new Set(['background']),
      };
    case 'footer':
      return {
        attributes: [],
        sections: ['text', 'padding', 'background'],
        defaultExpanded: new Set(),
      };
    case 'blockquote':
      return {
        attributes: [],
        sections: ['text', 'padding', 'background', 'border'],
        defaultExpanded: new Set(),
      };
    case 'bulletList':
      return {
        attributes: [],
        sections: ['alignment', 'text', 'padding', 'border'],
        defaultExpanded: new Set(['alignment', 'text']),
      };
    case 'orderedList':
      return {
        attributes: [],
        sections: ['alignment', 'padding', 'border'],
        defaultExpanded: new Set(['alignment']),
      };
    case 'listItem':
      return {
        attributes: [],
        sections: ['padding', 'border'],
        defaultExpanded: new Set(),
      };
    case 'twoColumns':
    case 'threeColumns':
    case 'fourColumns':
      return {
        attributes: [],
        sections: ['padding', 'background', 'border'],
        defaultExpanded: new Set(),
      };
    case 'columnsColumn':
      return {
        attributes: [],
        sections: ['size', 'padding', 'background', 'border'],
        defaultExpanded: new Set(['size']),
      };
    case 'table':
      return {
        attributes: [],
        sections: ['alignment', 'padding', 'border'],
        defaultExpanded: new Set(['alignment']),
      };
    case 'tableRow':
    case 'tableCell':
    case 'tableHeader':
      return {
        attributes: [],
        sections: ['padding', 'background', 'border'],
        defaultExpanded: new Set(),
      };
    case 'horizontalRule':
      return {
        attributes: [],
        sections: ['padding'],
        defaultExpanded: new Set(),
      };
    default:
      return {
        attributes: [],
        sections: ['alignment', 'text', 'padding', 'background', 'border'],
        defaultExpanded: new Set(['alignment']),
      };
  }
}

function sectionHasValues(
  sectionId: SectionId,
  styleObject: Record<string, string | number | undefined>,
  attrs: Record<string, unknown>,
): boolean {
  const props = SECTION_PROPERTIES[sectionId];
  if (!props) return false;
  return props.some(
    (prop) =>
      (styleObject[prop] !== undefined && styleObject[prop] !== '') ||
      (attrs[prop] !== undefined && attrs[prop] !== ''),
  );
}

export function InspectorLocal({ data }: { data: NodeClickedEvent }) {
  const { editor } = useCurrentEditor();
  const theming = useEmailTheming(editor);
  const linkMark = useLinkMark(editor);
  const [localAttr, setLocalAttr] = React.useState<
    NodeClickedEvent['nodeAttrs']
  >(data.nodeAttrs);

  const linkHref = linkMark.href;

  React.useEffect(() => {
    setLocalAttr(data.nodeAttrs);
  }, [data.nodeAttrs]);

  if (!editor || !theming) {
    return null;
  }

  if (data.nodeType === 'paragraph' || data.nodeType === 'heading') {
    return <InspectorText nodeData={data} />;
  }

  const css = stylesToCss(theming.styles, theming.theme);

  const { style, ...rawAttrs } = localAttr;
  const attrs = { ...rawAttrs } as Record<string, unknown>;
  const parsedStyles = inlineCssToJs(style || '', { removeUnit: true });
  const inlineStyleObject = expandShorthandProperties(parsedStyles);

  const themeDefaults = resolveThemeDefaults(data.nodeType, attrs, css);

  const styleObject = { ...themeDefaults, ...inlineStyleObject };

  const rawParsedStyles = inlineCssToJs(style || '', { removeUnit: false });
  const rawStyleObject = expandShorthandProperties(rawParsedStyles);

  const layout = getNodeLayout(data.nodeType);
  const attributeInputs = parseAttributes(attrs, layout.attributes);

  return (
    <InspectorLocalInner
      editor={editor}
      data={data}
      attrs={attrs}
      styleObject={styleObject}
      rawStyleObject={rawStyleObject}
      layout={layout}
      attributeInputs={attributeInputs}
      linkMark={linkMark}
      linkHref={linkHref}
      css={stylesToCss(theming.styles, theming.theme)}
      setLocalAttr={setLocalAttr}
    />
  );
}

interface InspectorLocalInnerProps {
  editor: NonNullable<ReturnType<typeof useCurrentEditor>['editor']>;
  data: NodeClickedEvent;
  attrs: Record<string, unknown>;
  styleObject: Record<string, string | number | undefined>;
  rawStyleObject: Record<string, string | number>;
  layout: NodeLayout;
  attributeInputs: ReturnType<typeof parseAttributes>;
  linkMark: ReturnType<typeof useLinkMark>;
  linkHref: string;
  css: Record<KnownThemeComponents, React.CSSProperties>;
  setLocalAttr: React.Dispatch<
    React.SetStateAction<NodeClickedEvent['nodeAttrs']>
  >;
}

function InspectorLocalInner({
  editor,
  data,
  attrs,
  styleObject,
  rawStyleObject,
  layout,
  attributeInputs,
  linkMark,
  linkHref,
  css,
  setLocalAttr,
}: InspectorLocalInnerProps) {
  const documentColors = useDocumentColors(editor);
  const [addedSections, setAddedSections] = React.useState<Set<SectionId>>(
    new Set(),
  );

  const layoutKey = layout.sections.join(',');
  const prevLayoutKeyRef = React.useRef(layoutKey);
  React.useEffect(() => {
    if (prevLayoutKeyRef.current !== layoutKey) {
      prevLayoutKeyRef.current = layoutKey;
      setAddedSections(new Set());
    }
  }, [layoutKey]);

  const shouldShow = (id: SectionId) =>
    layout.defaultExpanded.has(id) ||
    addedSections.has(id) ||
    sectionHasValues(id, styleObject, attrs);

  const isCollapsed = (id: SectionId) => !shouldShow(id);
  const isRemovable = (id: SectionId) => !layout.defaultExpanded.has(id);
  const addSection = (id: SectionId) =>
    setAddedSections((prev) => new Set([...prev, id]));
  const removeSection = (id: SectionId) =>
    setAddedSections((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const clearSectionProperties = (sectionId: SectionId) => {
    const props = SECTION_PROPERTIES[sectionId];
    if (!props) return;
    for (const prop of props) {
      if (LOCAL_PROPS_SCHEMA[prop]) {
        customUpdateAttributes(
          { editor, nodePos: data.nodePos, prop, newValue: '' },
          setLocalAttr,
        );
      } else {
        customUpdateStyles(
          { editor, nodePos: data.nodePos, prop, newValue: '' },
          setLocalAttr,
        );
      }
    }
    removeSection(sectionId);
  };

  const handleChange = (prop: string, newValue: string | number) => {
    if (
      (prop === 'width' || prop === 'height') &&
      !SIZE_AS_ATTRIBUTES.includes(data.nodeType)
    ) {
      customUpdateStyles(
        { editor, nodePos: data.nodePos, prop, newValue },
        setLocalAttr,
      );
      if (prop === 'width' && data.nodeType === 'columnsColumn') {
        customUpdateStyles(
          {
            editor,
            nodePos: data.nodePos,
            prop: 'flex',
            newValue: newValue ? 'none' : '',
          },
          setLocalAttr,
        );
      }
      return;
    }

    if (LOCAL_PROPS_SCHEMA[prop]) {
      LOCAL_PROPS_SCHEMA[prop]?.customUpdate?.({
        newValue: String(newValue),
      });

      customUpdateAttributes(
        { editor, nodePos: data.nodePos, prop, newValue },
        setLocalAttr,
      );
      return;
    }

    customUpdateStyles(
      { editor, nodePos: data.nodePos, prop, newValue },
      setLocalAttr,
    );
  };

  const handlePaddingChange = (values: Record<string, number>) => {
    Object.entries(values).forEach(([prop, value]) => {
      customUpdateStyles(
        { editor, nodePos: data.nodePos, prop, newValue: value },
        setLocalAttr,
      );
    });
  };

  const alignProp = 'align' in attrs ? 'align' : 'alignment';
  const alignmentValue =
    (attrs.align as string) || (attrs.alignment as string) || 'left';

  const has = (id: SectionId) => layout.sections.includes(id);

  return (
    <div className="w-full flex flex-col gap-5">
      {has('alignment') && (
        <Section title="Alignment">
          <ToggleGroup.Root
            value={alignmentValue}
            onValueChange={(value) => {
              if (!Array.isArray(value)) {
                handleChange(alignProp, value);
              }
            }}
            className="w-full"
          >
            {ALIGNMENT_ITEMS.map((item) => (
              <ToggleGroup.Item
                className="flex-1"
                key={item.value}
                value={item.value}
                aria-label={`Align ${item.value}`}
                tooltip={`Align ${item.value}`}
              >
                {item.icon}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </Section>
      )}

      {(linkHref || has('link')) && (
        <LinkSection
          href={linkHref || (attrs.href as string) || ''}
          onChange={linkHref ? undefined : handleChange}
          isCollapsed={linkHref ? false : isCollapsed('link')}
          onAdd={
            linkHref
              ? undefined
              : () => {
                  handleChange('href', '#');
                  addSection('link');
                }
          }
          onRemove={
            linkHref
              ? () => editor.chain().focus().unsetLink().run()
              : () => clearSectionProperties('link')
          }
          isLinkMark={!!linkHref}
          nodeType={data.nodeType}
        />
      )}

      <AttributesSection inputs={attributeInputs} onChange={handleChange} />

      {has('text') && (
        <TextSection
          styleObject={
            linkMark.isActive
              ? {
                  ...styleObject,
                  color: getLinkColor(
                    linkMark.style,
                    css.link?.color,
                    styleObject.color as string,
                  ),
                }
              : styleObject
          }
          onChange={(prop, value) => {
            if (prop === 'color' && linkMark.isActive) {
              updateLinkColor(editor, linkMark.style, String(value));
              return;
            }
            handleChange(prop, value);
          }}
          isCollapsed={isCollapsed('text')}
          onAdd={() => addSection('text')}
          onRemove={
            isRemovable('text')
              ? () => clearSectionProperties('text')
              : undefined
          }
          presetColors={documentColors}
        />
      )}

      {has('size') && (
        <SizeSection
          attrs={attrs}
          styleObject={styleObject}
          onChange={handleChange}
          isCollapsed={isCollapsed('size')}
          onAdd={() => addSection('size')}
          onRemove={
            isRemovable('size')
              ? () => clearSectionProperties('size')
              : undefined
          }
        />
      )}

      {has('padding') && (
        <PaddingSection
          styleObject={styleObject}
          onChange={handlePaddingChange}
          isCollapsed={isCollapsed('padding')}
          onAdd={() => addSection('padding')}
          onRemove={
            isRemovable('padding')
              ? () => clearSectionProperties('padding')
              : undefined
          }
        />
      )}

      {has('background') && (
        <BackgroundSection
          backgroundColor={styleObject.backgroundColor as string}
          onChange={handleChange}
          isCollapsed={isCollapsed('background')}
          onAdd={() => addSection('background')}
          onRemove={
            isRemovable('background')
              ? () => clearSectionProperties('background')
              : undefined
          }
          presetColors={documentColors}
        />
      )}

      {has('border') && (
        <BorderSection
          styleObject={styleObject}
          onChange={(propOrChanges, value) => {
            if (Array.isArray(propOrChanges)) {
              customUpdateStyles(
                { editor, nodePos: data.nodePos, changes: propOrChanges },
                setLocalAttr,
              );
            } else {
              handleChange(propOrChanges, value!);
            }
          }}
          isCollapsed={isCollapsed('border')}
          onAdd={() => addSection('border')}
          onRemove={
            isRemovable('border')
              ? () => clearSectionProperties('border')
              : undefined
          }
          presetColors={documentColors}
        />
      )}

      <OtherStylesSection
        styleObject={rawStyleObject}
        onChange={handleChange}
      />
    </div>
  );
}
