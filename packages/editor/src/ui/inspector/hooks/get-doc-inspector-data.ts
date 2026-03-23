import { useCurrentEditor } from '@tiptap/react';
import { useEmailTheming } from '../../../plugins/email-theming/extension';
import {
  EDITOR_THEMES,
  SUPPORTED_CSS_PROPERTIES,
} from '../../../plugins/email-theming/themes';
import type {
  KnownCssProperties,
  KnownThemeComponents,
  PanelGroup,
} from '../../../plugins/email-theming/types';
import type { InspectorPanelEntry } from './use-inspector-fields';

/**
 * Ensures every section shows all of its theme-default properties.
 */
function ensureAllProperties(
  currentStyles: PanelGroup[],
  themeDefaults: PanelGroup[],
): PanelGroup[] {
  return currentStyles.map((group) => {
    const defaultGroup = themeDefaults.find((g) =>
      group.id ? g.id === group.id : g.title === group.title,
    );

    if (!defaultGroup || defaultGroup.inputs.length === 0) {
      return group;
    }

    const existingProps = new Set(
      group.inputs.map((i) => `${i.classReference}:${i.prop}`),
    );

    const missingInputs = defaultGroup.inputs
      .filter(
        (defaultInput) =>
          !existingProps.has(
            `${defaultInput.classReference}:${defaultInput.prop}`,
          ),
      )
      .map((defaultInput) => {
        const propDef = SUPPORTED_CSS_PROPERTIES[defaultInput.prop];

        if (propDef && propDef.type === 'number') {
          return {
            ...defaultInput,
            value: '' as string | number,
            placeholder: String(propDef.defaultValue),
          };
        }

        return { ...defaultInput };
      });

    if (missingInputs.length === 0) {
      return group;
    }

    return {
      ...group,
      inputs: [...group.inputs, ...missingInputs],
    };
  });
}

/**
 * Pure function: apply a single property change to a styles array.
 */
function applyStyleChange(
  styles: PanelGroup[],
  theming: { theme: 'basic' | 'minimal' },
  change: {
    classReference?: string;
    prop: string;
    newValue: string | number;
  },
): PanelGroup[] {
  const { classReference, prop, newValue } = change;
  let found = false;

  const updatedStyles = styles.map((styleGroup) => {
    const matchingInput = styleGroup.inputs.find(
      (input) => input.classReference === classReference && input.prop === prop,
    );

    if (matchingInput) {
      found = true;
      return {
        ...styleGroup,
        inputs: styleGroup.inputs.map((input) => {
          if (input.classReference === classReference && input.prop === prop) {
            return { ...input, value: newValue };
          }
          return input;
        }),
      };
    }

    return styleGroup;
  });

  if (found) {
    return updatedStyles;
  }

  const propDef = SUPPORTED_CSS_PROPERTIES[prop as KnownCssProperties] ?? null;

  return updatedStyles.map((styleGroup) => {
    if (styleGroup.classReference !== classReference) {
      return styleGroup;
    }

    const themeDefaults = EDITOR_THEMES[theming.theme];
    const defaultGroup = themeDefaults.find((g) =>
      styleGroup.id ? g.id === styleGroup.id : g.title === styleGroup.title,
    );
    const defaultInput = defaultGroup?.inputs.find(
      (i) => i.prop === prop && i.classReference === classReference,
    );

    if (defaultInput) {
      return {
        ...styleGroup,
        inputs: [...styleGroup.inputs, { ...defaultInput, value: newValue }],
      };
    }

    if (propDef) {
      return {
        ...styleGroup,
        inputs: [
          ...styleGroup.inputs,
          {
            label: propDef.label,
            type: propDef.type,
            value: newValue,
            prop: prop as KnownCssProperties,
            classReference: classReference as KnownThemeComponents | undefined,
            unit: propDef.unit,
            options: propDef.options,
          },
        ],
      };
    }

    return styleGroup;
  });
}

export function getDocInspectorData(): InspectorPanelEntry[] | null {
  const { editor } = useCurrentEditor();
  const theming = useEmailTheming(editor);

  if (!editor || !theming) {
    return null;
  }

  const themeDefaults = EDITOR_THEMES[theming.theme];
  const groups = ensureAllProperties(theming.styles, themeDefaults);

  return groups.map(
    (group): InspectorPanelEntry => ({
      group,
      fields: group.inputs.map((input) => ({
        ...input,
        onChange: (newValue: string | number) => {
          const newStyles = applyStyleChange(theming.styles, theming, {
            classReference: input.classReference,
            prop: input.prop,
            newValue,
          });
          editor.commands.setGlobalContent('styles', newStyles);
        },
      })),
    }),
  );
}
