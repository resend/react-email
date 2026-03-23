import { useCurrentEditor } from '@tiptap/react';
import * as React from 'react';
import type { NodeClickedEvent } from '@/components/editor/core/types';
import type { KnownThemeComponents } from '@/components/editor/plugins/email-theming/types';
import { ToggleGroup } from '@/ui/toggle-group';
import {
  stylesToCss,
  useEmailTheming,
} from '../../../plugins/email-theming/extension';
import {
  expandShorthandProperties,
  inlineCssToJs,
} from '../../../utils/styles';
import { Section } from './components/section';
import { LOCAL_PROPS_SCHEMA } from './config/attribute-schema';
import {
  getNodeSectionConfig,
  SECTION_METADATA,
  type SectionId,
  SIZE_AS_ATTRIBUTES,
} from './config/node-section-config';
import { ALIGNMENT_ITEMS } from './config/text-config';
import { useCollapsibleSections } from './hooks/use-collapsible-sections';
import { useDocumentColors } from './hooks/use-document-colors';
import { AttributesSection } from './sections/attributes';
import { BackgroundSection } from './sections/background';
import { BorderSection } from './sections/border';
import { FallbackSection } from './sections/fallback';
import { LinkSection } from './sections/link';
import { OtherStylesSection } from './sections/other-styles';
import { PaddingSection } from './sections/padding';
import { SizeSection } from './sections/size';
import { SocialLinksSection } from './sections/social-links';
import { TextSection } from './sections/text';
import { InspectorText } from './text';
import { parseAttributes } from './utils/parse-attributes';
import { resolveThemeDefaults } from './utils/resolve-theme-defaults';
import {
  customUpdateAttributes,
  customUpdateStyles,
} from './utils/style-updates';
import {
  getLinkColor,
  updateLinkColor,
  useLinkMark,
} from './utils/use-link-mark';

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

  if (data.nodeType === 'variable') {
    return (
      <div className="w-full flex flex-col">
        <FallbackSection
          variableId={(localAttr.id as string) || ''}
          fallbackValue={(localAttr.fallback as string) || ''}
        />
      </div>
    );
  }
  if (data.nodeType === 'paragraph' || data.nodeType === 'heading') {
    return <InspectorText nodeData={data} />;
  }

  if (data.nodeType === 'socialLinks') {
    return (
      <div className="w-full flex flex-col">
        <SocialLinksSection editor={editor} data={data} />
      </div>
    );
  }

  const css = stylesToCss(theming.styles, theming.theme);

  const { style, ...rawAttrs } = localAttr;
  const attrs = { ...rawAttrs } as Record<string, unknown>;
  const parsedStyles = inlineCssToJs(style || '', { removeUnit: true });
  const inlineStyleObject = expandShorthandProperties(parsedStyles);

  const themeDefaults = resolveThemeDefaults(data.nodeType, attrs, css);

  const styleObject = { ...themeDefaults, ...inlineStyleObject };

  // Raw styles (without unit stripping) for "other styles" section
  const rawParsedStyles = inlineCssToJs(style || '', { removeUnit: false });
  const rawStyleObject = expandShorthandProperties(rawParsedStyles);

  const config = getNodeSectionConfig(data.nodeType);

  // Filter attributes based on config
  const attributeInputs = parseAttributes(attrs, config.attributes);

  return (
    <InspectorLocalInner
      editor={editor}
      data={data}
      attrs={attrs}
      styleObject={styleObject}
      rawStyleObject={rawStyleObject}
      config={config}
      attributeInputs={attributeInputs}
      linkMark={linkMark}
      linkHref={linkHref}
      css={stylesToCss(theming.styles, theming.theme)}
      setLocalAttr={setLocalAttr}
    />
  );
}

// ---------------------------------------------------------------------------
// Inner component that can safely use hooks unconditionally
// ---------------------------------------------------------------------------

interface InspectorLocalInnerProps {
  editor: NonNullable<ReturnType<typeof useCurrentEditor>['editor']>;
  data: NodeClickedEvent;
  attrs: Record<string, unknown>;
  styleObject: Record<string, string | number | undefined>;
  rawStyleObject: Record<string, string | number>;
  config: ReturnType<typeof getNodeSectionConfig>;
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
  config,
  attributeInputs,
  linkMark,
  linkHref,
  css,
  setLocalAttr,
}: InspectorLocalInnerProps) {
  const documentColors = useDocumentColors(editor);
  const { allSections, getSectionProps, addSection, removeSection } =
    useCollapsibleSections({
      expandedSections: config.expandedSections,
      collapsedSections: config.collapsedSections,
      styleObject,
      attrs,
    });

  // --- Section removal (clear properties then collapse) -------------------

  const handleRemoveSection = (sectionId: SectionId) => {
    const sectionMeta = SECTION_METADATA[sectionId];
    if (!sectionMeta) {
      return;
    }

    // Clear all properties for this section
    for (const prop of sectionMeta.properties) {
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

  // --- Change handlers ----------------------------------------------------

  const handleChange = (prop: string, newValue: string | number) => {
    // For width/height, check if this element uses attributes or styles
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

  // Determine which alignment prop to use
  const alignProp = 'align' in attrs ? 'align' : 'alignment';
  const alignmentValue =
    (attrs.align as string) || (attrs.alignment as string) || 'left';

  // --- Render -------------------------------------------------------------

  const linkProps = getSectionProps('link');
  const textProps = getSectionProps('text');
  const sizeProps = getSectionProps('size');
  const paddingProps = getSectionProps('padding');
  const backgroundProps = getSectionProps('background');
  const borderProps = getSectionProps('border');

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Alignment Section - Always first */}
      {allSections.includes('alignment') && (
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

      {/* Link Section - shows when cursor is over a link mark or for node attributes */}
      {(linkHref || allSections.includes('link')) && (
        <LinkSection
          href={linkHref || (attrs.href as string) || ''}
          onChange={linkHref ? undefined : handleChange}
          isCollapsed={linkHref ? false : linkProps.isCollapsed}
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
              : () => handleRemoveSection('link')
          }
          isLinkMark={!!linkHref}
          nodeType={data.nodeType}
        />
      )}

      {/* Attributes Section */}
      <AttributesSection inputs={attributeInputs} onChange={handleChange} />

      {/* Text Section */}
      {allSections.includes('text') && (
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
          isCollapsed={textProps.isCollapsed}
          onAdd={textProps.onAdd}
          onRemove={
            textProps.onRemove ? () => handleRemoveSection('text') : undefined
          }
          presetColors={documentColors}
        />
      )}

      {/* Size Section (for images and buttons) */}
      {allSections.includes('size') && (
        <SizeSection
          attrs={attrs}
          styleObject={styleObject}
          onChange={handleChange}
          isCollapsed={sizeProps.isCollapsed}
          onAdd={sizeProps.onAdd}
          onRemove={
            sizeProps.onRemove ? () => handleRemoveSection('size') : undefined
          }
        />
      )}

      {/* Padding Section */}
      {allSections.includes('padding') && (
        <PaddingSection
          styleObject={styleObject}
          onChange={handlePaddingChange}
          isCollapsed={paddingProps.isCollapsed}
          onAdd={paddingProps.onAdd}
          onRemove={
            paddingProps.onRemove
              ? () => handleRemoveSection('padding')
              : undefined
          }
        />
      )}

      {/* Background Section */}
      {allSections.includes('background') && (
        <BackgroundSection
          backgroundColor={styleObject.backgroundColor as string}
          onChange={handleChange}
          isCollapsed={backgroundProps.isCollapsed}
          onAdd={backgroundProps.onAdd}
          onRemove={
            backgroundProps.onRemove
              ? () => handleRemoveSection('background')
              : undefined
          }
          presetColors={documentColors}
        />
      )}

      {/* Border Section */}
      {allSections.includes('border') && (
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
          isCollapsed={borderProps.isCollapsed}
          onAdd={borderProps.onAdd}
          onRemove={
            borderProps.onRemove
              ? () => handleRemoveSection('border')
              : undefined
          }
          presetColors={documentColors}
        />
      )}

      {/* Other Styles Section - shows unsupported CSS properties from imported templates */}
      <OtherStylesSection
        styleObject={rawStyleObject}
        onChange={handleChange}
      />
    </div>
  );
}
