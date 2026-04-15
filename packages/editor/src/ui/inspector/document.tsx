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
import { NumberInput } from './components/number-input';
import { PropRow } from './components/prop-row';
import { Section } from './components/section';
import { ColorInput, Label } from './primitives';
import { useInspector } from './root';

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
  children?: (context: InspectorDocumentContext) => React.ReactNode;
}

export function InspectorDocument({ children }: InspectorDocumentProps) {
  const { editor } = useCurrentEditor();
  const theming = useEmailTheming(editor);
  const inspector = useInspector();

  if (!inspector.ready || !editor || !theming) {
    return null;
  }

  const { target } = inspector;

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
      if (input && input.value !== undefined) return input.value;
    }

    for (const group of themeDefaults) {
      const input = group.inputs.find(
        (i) => i.classReference === classReference && i.prop === prop,
      );
      if (input && input.value !== undefined) return input.value;
    }

    const propDef = SUPPORTED_CSS_PROPERTIES[prop];
    return propDef?.defaultValue ?? '';
  }

  if (typeof target !== 'object' || target.nodeType !== 'body') {
    return null;
  }

  const context: InspectorDocumentContext = {
    styles: groups,
    setGlobalStyle,
    batchSetGlobalStyle,
    findStyleValue,
  };

  if (children) {
    return <>{children(context)}</>;
  }

  return <InspectorDocumentDefaults context={context} />;
}

function InspectorDocumentDefaults({
  context,
}: {
  context: InspectorDocumentContext;
}) {
  const { findStyleValue, setGlobalStyle } = context;

  return (
    <>
      <Section title="Background">
        <PropRow>
          <Label>Color</Label>
          <ColorInput
            value={String(findStyleValue('body', 'backgroundColor') ?? '')}
            onChange={(v) => setGlobalStyle('body', 'backgroundColor', v)}
          />
        </PropRow>
        <PropRow>
          <Label>Padding</Label>
          <NumberInput
            value={findStyleValue('body', 'padding') ?? ''}
            onChange={(v) => setGlobalStyle('body', 'padding', v)}
            unit="px"
          />
        </PropRow>
      </Section>

      <Section title="Container">
        <PropRow>
          <Label>Color</Label>
          <ColorInput
            value={String(findStyleValue('container', 'backgroundColor') ?? '')}
            onChange={(v) => setGlobalStyle('container', 'backgroundColor', v)}
          />
        </PropRow>
        <PropRow>
          <Label>Width</Label>
          <NumberInput
            value={findStyleValue('container', 'width') ?? ''}
            onChange={(v) => setGlobalStyle('container', 'width', v)}
            unit="px"
          />
        </PropRow>
        <PropRow>
          <Label>Padding</Label>
          <NumberInput
            value={findStyleValue('container', 'padding') ?? ''}
            onChange={(v) => setGlobalStyle('container', 'padding', v)}
            unit="px"
          />
        </PropRow>
        <PropRow>
          <Label>Rounded</Label>
          <NumberInput
            value={findStyleValue('container', 'borderRadius') ?? ''}
            onChange={(v) => setGlobalStyle('container', 'borderRadius', v)}
            unit="px"
          />
        </PropRow>
      </Section>
    </>
  );
}
