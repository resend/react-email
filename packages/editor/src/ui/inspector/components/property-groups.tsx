import { useCurrentEditor } from '@tiptap/react';
import * as React from 'react';
import { getPanelTitle } from '../../../plugins/email-theming/themes';
import type {
  PanelGroup,
  PanelSectionId,
} from '../../../plugins/email-theming/types';
import {
  DEFAULT_GLOBAL_PANEL_CONFIG,
  GLOBAL_SECTION_CONFIG,
  type SectionId,
} from '../inspector/config/node-section-config';
import { useDocumentColors } from '../inspector/hooks/use-document-colors';
import {
  buildPropClassMap,
  inputsToStyleObject,
} from '../inspector/utils/panel-group-utils';
import { PropRow } from './prop-row';
import { StylePanel } from './style-panel';
import { TextInput } from './text-input';

type ChangePayload = {
  prop: string;
  newValue: string | number;
  classReference?: string;
};

interface PropertyGroupsProps {
  renderTree: PanelGroup[];
  onChange: (props: ChangePayload) => void;
  /** Batch-apply multiple property changes in a single update. When provided,
   *  padding changes use this to avoid stale-state issues from sequential calls. */
  onBatchChange?: (changes: ChangePayload[]) => void;
  /** When true, section titles (Typography, Padding, etc.) are shown inside StylePanel. Defaults to true. */
  showSectionTitles?: boolean;
}

export function PropertyGroups({
  renderTree,
  onChange,
  onBatchChange,
  showSectionTitles = true,
}: PropertyGroupsProps) {
  const { editor } = useCurrentEditor();
  const documentColors = useDocumentColors(editor);
  const [hasGeneratedAltText, setHasGeneratedAltText] = React.useState<
    boolean | null
  >(null);

  const srcInput = renderTree
    .flatMap((group) => group.inputs)
    .find((input) => (input.prop as string) === 'src');
  const imageSrc = (srcInput?.value as string) || '';
  const hasImage = !!imageSrc;

  React.useEffect(() => {
    const altInput = renderTree
      .flatMap((group) => group.inputs)
      .find((input) => (input.prop as string) === 'alt');
    if (altInput) {
      setHasGeneratedAltText((prev) =>
        prev === null ? !!(altInput.value as string) : prev,
      );
    }
  }, [renderTree]);

  return (
    <>
      {renderTree.map((styleGroup) => {
        const title = getPanelTitle(styleGroup);
        const sections: SectionId[] =
          GLOBAL_SECTION_CONFIG[styleGroup.id as PanelSectionId] ??
          DEFAULT_GLOBAL_PANEL_CONFIG;
        const styleObject = inputsToStyleObject(styleGroup.inputs);
        const propClassMap = buildPropClassMap(styleGroup.inputs);

        // Inputs that are not covered by StylePanel sections (e.g. text, textarea)
        const unsupportedInputs = styleGroup.inputs.filter(
          (input) => input.type === 'text' || input.type === 'textarea',
        );

        const hasStyleSections = sections.length > 0;
        const hasUnsupportedInputs = unsupportedInputs.length > 0;

        if (!hasStyleSections && !hasUnsupportedInputs) {
          return null;
        }

        return (
          <div
            key={styleGroup.id ?? title}
            data-section={title}
            className="mt-5 border-t border-gray-2 pt-5 first-of-type:mt-0 first-of-type:border-t-0 first-of-type:pt-0 flex flex-col gap-3"
          >
            <div className="flex flex-row justify-between items-center">
              <Text color="white" weight="bold">
                {title}
              </Text>
              {styleGroup.headerSlot && styleGroup.headerSlot}
            </div>

            {/* Unsupported input types rendered as individual rows */}
            {hasUnsupportedInputs &&
              unsupportedInputs.map((input) => (
                <PropRow key={input.label + input.prop + title}>
                  <Label
                    title={input.label}
                    className="truncate"
                    htmlFor={`${input.prop}-input`}
                  >
                    {input.label}
                  </Label>
                  {input.type === 'text' && (
                    <TextInput
                      placeholder={input?.placeholder}
                      enableVariables={!!input.options?.enableVariables}
                      value={input.value ?? ''}
                      onChange={(newValue) => {
                        onChange({
                          classReference: input.classReference,
                          prop: input.prop,
                          newValue,
                        });
                      }}
                    />
                  )}
                  {input.type === 'textarea' && (
                    <div className="relative flex-1 group">
                      <Textarea
                        className="h-[160px] max-h-[300px] px-1.5 py-1 resize-y text-xs pr-8"
                        value={input.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          setHasGeneratedAltText(!!value);
                          onChange({
                            classReference: input.classReference,
                            prop: input.prop,
                            newValue: value,
                          });
                        }}
                        placeholder={input?.placeholder}
                      />
                      {(input.prop as string) === 'alt' && (
                        <div className="absolute right-2 bottom-3 z-10 pointer-events-auto">
                          <SparklesButton
                            isDisabled={!hasImage}
                            isGenerating={isGeneratingAltText}
                            hasGeneratedContent={
                              hasGeneratedAltText !== null
                                ? hasGeneratedAltText
                                : !!(input.value as string)
                            }
                            onClick={handleGenerateAltText}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </PropRow>
              ))}

            {/* Style sections rendered via StylePanel */}
            {hasStyleSections && (
              <StylePanel
                title={title}
                styleObject={styleObject}
                sections={sections}
                showSectionTitles={showSectionTitles}
                presetColors={documentColors}
                onChange={(prop, value) => {
                  onChange({
                    prop,
                    newValue: value,
                    classReference:
                      propClassMap[prop] ?? styleGroup.classReference,
                  });
                }}
                onBatchChange={
                  onBatchChange
                    ? (changes) => {
                        onBatchChange(
                          changes.map(([prop, value]) => ({
                            prop,
                            newValue: value,
                            classReference:
                              propClassMap[prop] ?? styleGroup.classReference,
                          })),
                        );
                      }
                    : undefined
                }
                onPaddingChange={(values) => {
                  const changes = Object.entries(values).map(
                    ([prop, value]) => ({
                      prop,
                      newValue: value,
                      classReference:
                        propClassMap[prop] ?? styleGroup.classReference,
                    }),
                  );
                  if (onBatchChange) {
                    onBatchChange(changes);
                  } else {
                    for (const change of changes) {
                      onChange(change);
                    }
                  }
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
