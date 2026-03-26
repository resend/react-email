import { useCurrentEditor } from '@tiptap/react';
import {
  setGlobalStyles,
  useEmailTheming,
} from '../../plugins/email-theming/extension';
import {
  EDITOR_THEMES,
  SUPPORTED_CSS_PROPERTIES,
} from '../../plugins/email-theming/themes';
import type {
  KnownCssProperties,
  KnownThemeComponents,
  PanelGroup,
} from '../../plugins/email-theming/types';
import { useInspector } from './provider';

/**
 * Ensures every section shows all of its theme-default properties.
 *
 * For each group in the current styles, we look up the matching group from the
 * theme definition. Any property present in the theme default but missing from
 * the stored data is added with:
 *   - `number` inputs  → `value: ''` + `placeholder` showing the default
 *   - everything else  → `value` set to the theme default value
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
 * Pure function: apply a single property change to a styles array and
 * return the new array.
 */
function applyStyleChange(
  styles: PanelGroup[],
  themeName: 'basic' | 'minimal',
  {
    classReference,
    prop,
    newValue,
  }: {
    classReference?: string;
    prop: string;
    newValue: string | number;
  },
): PanelGroup[] {
  let found = false;

  // First pass: try to update an existing input in the stored styles
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

  // Second pass: if the property wasn't in the stored data yet, add it to
  // the matching group (upsert). This handles "filled-in" default properties
  // that the user is setting for the first time.
  const propDef = SUPPORTED_CSS_PROPERTIES[prop as KnownCssProperties] ?? null;

  return updatedStyles.map((styleGroup) => {
    if (styleGroup.classReference !== classReference) {
      return styleGroup;
    }

    // Try to pull metadata from the theme defaults so we get the right
    // label / type / unit for this property.
    const themeDefaults = EDITOR_THEMES[themeName];
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

    // Fallback: build the input from SUPPORTED_CSS_PROPERTIES
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

export type SetGlobalStyle = (
  classReference: KnownThemeComponents,
  property: KnownCssProperties,
  value: unknown,
) => void;

export type BatchSetGlobalStyle = (
  changes: Array<{
    classReference: KnownThemeComponents;
    property: KnownCssProperties;
    value: unknown;
  }>,
) => void;

export type FindStyleValue = (
  classReference: KnownThemeComponents,
  prop: KnownCssProperties,
) => string | number;

export interface InspectorDocumentContext {
  styles: PanelGroup[];
  setGlobalStyle: SetGlobalStyle;
  batchSetGlobalStyle: BatchSetGlobalStyle;
  findStyleValue: FindStyleValue;
}

export interface InspectorDocumentProps {
  children: (context: InspectorDocumentContext) => React.ReactNode;
}

export function InspectorDocument({ children }: InspectorDocumentProps) {
  const { editor } = useCurrentEditor();
  const theming = useEmailTheming(editor);
  const { inspectorTarget } = useInspector();

  if (!editor || !theming) {
    return null;
  }

  const themeDefaults = EDITOR_THEMES[theming.theme];

  const groups = ensureAllProperties(theming.styles, themeDefaults);

  function setGlobalStyle(
    classReference: KnownThemeComponents,
    property: KnownCssProperties,
    value: unknown,
  ) {
    const newStyles = applyStyleChange(theming!.styles, theming!.theme, {
      classReference,
      prop: property,
      newValue: value as string | number,
    });
    setGlobalStyles(editor!, newStyles);
  }

  function batchSetGlobalStyle(
    changes: Array<{
      classReference: KnownThemeComponents;
      property: KnownCssProperties;
      value: unknown;
    }>,
  ) {
    let styles = theming!.styles;
    for (const change of changes) {
      styles = applyStyleChange(styles, theming!.theme, {
        classReference: change.classReference,
        prop: change.property,
        newValue: change.value as string | number,
      });
    }
    setGlobalStyles(editor!, styles);
  }

  function findStyleValue(
    classReference: KnownThemeComponents,
    prop: KnownCssProperties,
  ): string | number {
    for (const group of groups) {
      const input = group.inputs.find(
        (i) => i.classReference === classReference && i.prop === prop,
      );
      if (input) return input.value;
    }

    // Fall back to the theme default
    for (const group of themeDefaults) {
      const input = group.inputs.find(
        (i) => i.classReference === classReference && i.prop === prop,
      );
      if (input) return input.value;
    }

    const propDef = SUPPORTED_CSS_PROPERTIES[prop];
    return propDef?.defaultValue ?? '';
  }

  if (inspectorTarget === 'doc') {
    return (
      <>
        {children({
          styles: groups,
          setGlobalStyle,
          batchSetGlobalStyle,
          findStyleValue,
        })}
      </>
    );
  }
}
