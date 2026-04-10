import type {
  EditorTheme,
  PanelGroup,
  PanelSectionId,
  ResetTheme,
  SupportedCssProperties,
} from './types';

/**
 * Single source of truth for panel section display titles.
 * Titles are resolved from here at render time via `getPanelTitle`,
 * so they never depend on what's persisted in the DB.
 */
const PANEL_SECTION_TITLES: Record<PanelSectionId, string> = {
  body: 'Background',
  container: 'Body',
  typography: 'Text',
  h1: 'Title',
  h2: 'Subtitle',
  h3: 'Heading',
  link: 'Link',
  image: 'Image',
  button: 'Button',
  'code-block': 'Code Block',
  'inline-code': 'Inline Code',
};

/**
 * Resolves the display title for a panel group.
 * Uses the `id` lookup when available, falls back to the
 * DB-persisted `title` for backwards compatibility.
 */
export function getPanelTitle(group: PanelGroup): string {
  if (group.id && group.id in PANEL_SECTION_TITLES) {
    return PANEL_SECTION_TITLES[group.id];
  }
  return group.title;
}

const THEME_BASIC: PanelGroup[] = [
  {
    id: 'body',
    title: 'Background',
    classReference: 'body',
    inputs: [
      {
        label: 'Background',
        type: 'color',
        value: '#ffffff',
        prop: 'backgroundColor',
        classReference: 'body',
      },
      {
        label: 'Padding Top',
        type: 'number',
        value: undefined,
        unit: 'px',
        prop: 'paddingTop',
        classReference: 'body',
      },
      {
        label: 'Padding Right',
        type: 'number',
        value: undefined,
        unit: 'px',
        prop: 'paddingRight',
        classReference: 'body',
      },
      {
        label: 'Padding Bottom',
        type: 'number',
        value: undefined,
        unit: 'px',
        prop: 'paddingBottom',
        classReference: 'body',
      },
      {
        label: 'Padding Left',
        type: 'number',
        value: undefined,
        unit: 'px',
        prop: 'paddingLeft',
        classReference: 'body',
      },
    ],
  },
  {
    id: 'container',
    title: 'Content',
    classReference: 'container',
    inputs: [
      {
        label: 'Align',
        type: 'select',
        value: 'left',
        options: {
          left: 'Left',
          center: 'Center',
          right: 'Right',
        },
        prop: 'align',
        classReference: 'container',
      },
      {
        label: 'Width',
        type: 'number',
        value: 600,
        unit: 'px',
        prop: 'width',
        classReference: 'container',
      },
      {
        label: 'Height',
        type: 'number',
        unit: 'px',
        prop: 'height',
        classReference: 'container',
      },
      {
        label: 'Text',
        type: 'color',
        value: '#000000',
        prop: 'color',
        classReference: 'container',
      },
      {
        label: 'Background',
        type: 'color',
        value: '#ffffff',
        prop: 'backgroundColor',
        classReference: 'container',
      },
      {
        label: 'Padding Top',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingTop',
        classReference: 'container',
      },
      {
        label: 'Padding Right',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingRight',
        classReference: 'container',
      },
      {
        label: 'Padding Bottom',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingBottom',
        classReference: 'container',
      },
      {
        label: 'Padding Left',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingLeft',
        classReference: 'container',
      },
      {
        label: 'Corner radius',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'borderRadius',
        classReference: 'container',
      },
      {
        label: 'Border color',
        type: 'color',
        value: '#000000',
        prop: 'borderColor',
        classReference: 'container',
      },
    ],
  },
  {
    id: 'typography',
    title: 'Text',
    classReference: 'body',
    inputs: [
      {
        label: 'Font size',
        type: 'number',
        value: 14,
        unit: 'px',
        prop: 'fontSize',
        classReference: 'body',
      },
      {
        label: 'Line Height',
        type: 'number',
        value: 155,
        unit: '%',
        prop: 'lineHeight',
        classReference: 'container',
      },
    ],
  },
  {
    id: 'h1',
    title: 'Title',
    category: 'Text',
    classReference: 'h1',
    inputs: [],
  },
  {
    id: 'h2',
    title: 'Subtitle',
    category: 'Text',
    classReference: 'h2',
    inputs: [],
  },
  {
    id: 'h3',
    title: 'Heading',
    category: 'Text',
    classReference: 'h3',
    inputs: [],
  },
  {
    id: 'link',
    title: 'Link',
    classReference: 'link',
    inputs: [
      {
        label: 'Color',
        type: 'color',
        value: '#0670DB',
        prop: 'color',
        classReference: 'link',
      },
      {
        label: 'Decoration',
        type: 'select',
        value: 'underline',
        prop: 'textDecoration',
        options: {
          underline: 'Underline',
          none: 'None',
        },
        classReference: 'link',
      },
    ],
  },
  {
    id: 'image',
    title: 'Image',
    classReference: 'image',
    inputs: [
      {
        label: 'Border radius',
        type: 'number',
        value: 8,
        unit: 'px',
        prop: 'borderRadius',
        classReference: 'image',
      },
    ],
  },
  {
    id: 'button',
    title: 'Button',
    classReference: 'button',
    inputs: [
      {
        label: 'Background',
        type: 'color',
        value: '#000000',
        prop: 'backgroundColor',
        classReference: 'button',
      },
      {
        label: 'Text color',
        type: 'color',
        value: '#ffffff',
        prop: 'color',
        classReference: 'button',
      },
      {
        label: 'Radius',
        type: 'number',
        value: 4,
        unit: 'px',
        prop: 'borderRadius',
        classReference: 'button',
      },
      {
        label: 'Padding Top',
        type: 'number',
        value: 7,
        unit: 'px',
        prop: 'paddingTop',
        classReference: 'button',
      },
      {
        label: 'Padding Right',
        type: 'number',
        value: 12,
        unit: 'px',
        prop: 'paddingRight',
        classReference: 'button',
      },
      {
        label: 'Padding Bottom',
        type: 'number',
        value: 7,
        unit: 'px',
        prop: 'paddingBottom',
        classReference: 'button',
      },
      {
        label: 'Padding Left',
        type: 'number',
        value: 12,
        unit: 'px',
        prop: 'paddingLeft',
        classReference: 'button',
      },
    ],
  },
  {
    id: 'code-block',
    title: 'Code Block',
    classReference: 'codeBlock',
    inputs: [
      {
        label: 'Border Radius',
        type: 'number',
        value: 4,
        unit: 'px',
        prop: 'borderRadius',
        classReference: 'codeBlock',
      },
      {
        label: 'Padding Top',
        type: 'number',
        value: 12,
        unit: 'px',
        prop: 'paddingTop',
        classReference: 'codeBlock',
      },
      {
        label: 'Padding Bottom',
        type: 'number',
        value: 12,
        unit: 'px',
        prop: 'paddingBottom',
        classReference: 'codeBlock',
      },
      {
        label: 'Padding Left',
        type: 'number',
        value: 16,
        unit: 'px',
        prop: 'paddingLeft',
        classReference: 'codeBlock',
      },
      {
        label: 'Padding Right',
        type: 'number',
        value: 16,
        unit: 'px',
        prop: 'paddingRight',
        classReference: 'codeBlock',
      },
    ],
  },
  {
    id: 'inline-code',
    title: 'Inline Code',
    classReference: 'inlineCode',
    inputs: [
      {
        label: 'Background',
        type: 'color',
        value: '#e5e7eb',
        prop: 'backgroundColor',
        classReference: 'inlineCode',
      },
      {
        label: 'Text color',
        type: 'color',
        value: '#1e293b',
        prop: 'color',
        classReference: 'inlineCode',
      },
      {
        label: 'Radius',
        type: 'number',
        value: 4,
        unit: 'px',
        prop: 'borderRadius',
        classReference: 'inlineCode',
      },
    ],
  },
];

const THEME_MINIMAL: PanelGroup[] = [
  {
    id: 'body',
    title: 'Background',
    classReference: 'body',
    inputs: [
      {
        label: 'Background',
        type: 'color',
        value: '#ffffff',
        prop: 'backgroundColor',
        classReference: 'body',
      },
      {
        label: 'Padding Top',
        type: 'number',
        value: undefined,
        unit: 'px',
        prop: 'paddingTop',
        classReference: 'body',
      },
      {
        label: 'Padding Right',
        type: 'number',
        value: undefined,
        unit: 'px',
        prop: 'paddingRight',
        classReference: 'body',
      },
      {
        label: 'Padding Bottom',
        type: 'number',
        value: undefined,
        unit: 'px',
        prop: 'paddingBottom',
        classReference: 'body',
      },
      {
        label: 'Padding Left',
        type: 'number',
        value: undefined,
        unit: 'px',
        prop: 'paddingLeft',
        classReference: 'body',
      },
    ],
  },
  {
    id: 'container',
    title: 'Content',
    classReference: 'container',
    inputs: [
      {
        label: 'Align',
        type: 'select',
        value: 'left',
        options: {
          left: 'Left',
          center: 'Center',
          right: 'Right',
        },
        prop: 'align',
        classReference: 'container',
      },
      {
        label: 'Width',
        type: 'number',
        value: 600,
        unit: 'px',
        prop: 'width',
        classReference: 'container',
      },
      {
        label: 'Height',
        type: 'number',
        unit: 'px',
        prop: 'height',
        classReference: 'container',
      },
      {
        label: 'Text',
        type: 'color',
        value: '#000000',
        prop: 'color',
        classReference: 'container',
      },
      {
        label: 'Background',
        type: 'color',
        value: '#ffffff',
        prop: 'backgroundColor',
        classReference: 'container',
      },
      {
        label: 'Padding Top',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingTop',
        classReference: 'container',
      },
      {
        label: 'Padding Right',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingRight',
        classReference: 'container',
      },
      {
        label: 'Padding Bottom',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingBottom',
        classReference: 'container',
      },
      {
        label: 'Padding Left',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingLeft',
        classReference: 'container',
      },
      {
        label: 'Corner radius',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'borderRadius',
        classReference: 'container',
      },
      {
        label: 'Border color',
        type: 'color',
        value: '#000000',
        prop: 'borderColor',
        classReference: 'container',
      },
    ],
  },
  {
    id: 'typography',
    title: 'Text',
    classReference: 'body',
    inputs: [],
  },
  {
    id: 'h1',
    title: 'Title',
    category: 'Text',
    classReference: 'h1',
    inputs: [],
  },
  {
    id: 'h2',
    title: 'Subtitle',
    category: 'Text',
    classReference: 'h2',
    inputs: [],
  },
  {
    id: 'h3',
    title: 'Heading',
    category: 'Text',
    classReference: 'h3',
    inputs: [],
  },
  {
    id: 'link',
    title: 'Link',
    classReference: 'link',
    inputs: [],
  },
  {
    id: 'image',
    title: 'Image',
    classReference: 'image',
    inputs: [],
  },
  {
    id: 'button',
    title: 'Button',
    classReference: 'button',
    inputs: [],
  },
  {
    id: 'code-block',
    title: 'Code Block',
    classReference: 'codeBlock',
    inputs: [],
  },
  {
    id: 'inline-code',
    title: 'Inline Code',
    classReference: 'inlineCode',
    inputs: [],
  },
];

const RESET_BASIC: ResetTheme = {
  reset: {
    margin: '0',
    padding: '0',
  },
  body: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '14px',
    minHeight: '100%',
    lineHeight: '155%',
  },
  container: {},
  h1: {
    fontSize: '2.25em',
    lineHeight: '1.44em',
    paddingTop: '0.389em',
    fontWeight: 600,
  },
  h2: {
    fontSize: '1.8em',
    lineHeight: '1.44em',
    paddingTop: '0.389em',
    fontWeight: 600,
  },
  h3: {
    fontSize: '1.4em',
    lineHeight: '1.08em',
    paddingTop: '0.389em',
    fontWeight: 600,
  },
  paragraph: {
    fontSize: '1em',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
  },
  list: {
    paddingLeft: '1.1em',
    paddingBottom: '1em',
  },
  nestedList: {
    paddingLeft: '1.1em',
    paddingBottom: '0',
  },
  listItem: {
    marginLeft: '1em',
    marginBottom: '0.3em',
    marginTop: '0.3em',
  },
  listParagraph: { padding: '0', margin: '0' },
  blockquote: {
    borderLeft: '3px solid #acb3be',
    color: '#7e8a9a',
    marginLeft: 0,
    paddingLeft: '0.8em',
    fontSize: '1.1em',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  link: { textDecoration: 'underline' },
  footer: {
    fontSize: '0.8em',
  },
  hr: {
    paddingBottom: '1em',
    borderWidth: '2px',
  },
  image: {
    maxWidth: '100%',
  },
  button: {
    lineHeight: '100%',
    display: 'inline-block',
  },
  inlineCode: {
    paddingTop: '0.25em',
    paddingBottom: '0.25em',
    paddingLeft: '0.4em',
    paddingRight: '0.4em',
    background: '#e5e7eb',
    color: '#1e293b',
    borderRadius: '4px',
  },
  codeBlock: {
    fontFamily: 'monospace',
    fontWeight: '500',
    fontSize: '.92em',
  },
  codeTag: {
    lineHeight: '130%',
    fontFamily: 'monospace',
    fontSize: '.92em',
  },
  section: {
    padding: '10px 20px 10px 20px',
    boxSizing: 'border-box' as const,
  },
};

const RESET_MINIMAL: ResetTheme = {
  ...Object.keys(RESET_BASIC).reduce<ResetTheme>((acc, key) => {
    acc[key as keyof ResetTheme] = {};
    return acc;
  }, {} as ResetTheme),
  reset: RESET_BASIC.reset,
  h1: { fontSize: 'inherit', fontWeight: 'normal', margin: '0.25em 0' },
  h2: { fontSize: 'inherit', fontWeight: 'normal', margin: '0.25em 0' },
  h3: { fontSize: 'inherit', fontWeight: 'normal', margin: '0.25em 0' },
  link: { color: 'inherit', textDecoration: 'none' },
  blockquote: {
    borderLeft: 'none',
    color: 'inherit',
    margin: '0.25em 0',
    paddingLeft: '0',
  },
  inlineCode: {
    background: 'none',
    borderRadius: '0',
    padding: '0',
    fontSize: 'inherit',
  },
  codeBlock: {
    background: 'none',
    borderRadius: '0',
    padding: '0',
  },
  button: {
    display: 'inline-block',
    padding: '0',
    background: 'transparent',
    color: 'inherit',
    borderRadius: '0',
    fontWeight: 'inherit',
    fontSize: 'inherit',
    textDecoration: 'none',
  },
  image: RESET_BASIC.image,
};

export const RESET_THEMES: Record<EditorTheme, ResetTheme> = {
  basic: RESET_BASIC,
  minimal: RESET_MINIMAL,
};

export function resolveResetValue(
  value: string | number | undefined,
  targetUnit: 'px' | '%',
  bodyFontSizePx: number,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  const str = String(value);
  const num = Number.parseFloat(str);
  if (Number.isNaN(num)) {
    return undefined;
  }
  if (str.endsWith('em')) {
    return targetUnit === 'px' ? Math.floor(num * bodyFontSizePx) : num * 100;
  }
  return num;
}

export const EDITOR_THEMES: Record<EditorTheme, PanelGroup[]> = {
  minimal: THEME_MINIMAL,
  basic: THEME_BASIC,
};

export function getThemeBodyFontSizePx(theme: EditorTheme): number {
  for (const group of EDITOR_THEMES[theme]) {
    if (group.classReference !== 'body') {
      continue;
    }
    for (const input of group.inputs) {
      if (input.prop === 'fontSize' && typeof input.value === 'number') {
        return input.value;
      }
    }
  }
  return 14;
}

/**
 * Use to make the preview nicer once the theme might miss some
 * important properties to make layout accurate
 */
export const DEFAULT_INBOX_FONT_SIZE_PX = 14;
export const INBOX_EMAIL_DEFAULTS: Partial<ResetTheme> = {
  body: {
    color: '#000000',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: `${DEFAULT_INBOX_FONT_SIZE_PX}px`,
    lineHeight: '155%',
  },
  container: {
    width: 600,
  },
};

export const SUPPORTED_CSS_PROPERTIES: SupportedCssProperties = {
  align: {
    label: 'Align',
    type: 'select',
    options: {
      left: 'Left',
      center: 'Center',
      right: 'Right',
    },
    defaultValue: 'left',
    category: 'layout',
  },
  backgroundColor: {
    label: 'Background',
    type: 'color',
    excludeNodes: ['image', 'youtube'],
    defaultValue: '#ffffff',
    category: 'appearance',
  },
  color: {
    label: 'Text color',
    type: 'color',
    excludeNodes: ['image', 'youtube'],
    defaultValue: '#000000',
    category: 'typography',
  },
  fontSize: {
    label: 'Font size',
    type: 'number',
    unit: 'px',
    excludeNodes: ['image', 'youtube'],
    defaultValue: 14,
    category: 'typography',
  },
  fontWeight: {
    label: 'Font weight',
    type: 'select',
    options: {
      300: 'Light',
      400: 'Normal',
      600: 'Semi Bold',
      700: 'Bold',
      800: 'Extra Bold',
    },
    excludeNodes: ['image', 'youtube'],
    defaultValue: 400,
    category: 'typography',
  },
  letterSpacing: {
    label: 'Letter spacing',
    type: 'number',
    unit: 'px',
    excludeNodes: ['image', 'youtube'],
    defaultValue: 0,
    category: 'typography',
  },
  lineHeight: {
    label: 'Line height',
    type: 'number',
    unit: '%',
    defaultValue: 155,
    category: 'typography',
  },
  textDecoration: {
    label: 'Text decoration',
    type: 'select',
    options: {
      none: 'None',
      underline: 'Underline',
      'line-through': 'Line-through',
    },
    defaultValue: 'none',
    category: 'typography',
  },
  borderRadius: {
    label: 'Border Radius',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'appearance',
  },
  borderTopLeftRadius: {
    label: 'Border Radius (Top-Left)',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'appearance',
  },
  borderTopRightRadius: {
    label: 'Border Radius (Top-Right)',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'appearance',
  },
  borderBottomLeftRadius: {
    label: 'Border Radius (Bottom-Left)',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'appearance',
  },
  borderBottomRightRadius: {
    label: 'Border Radius (Bottom-Right)',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'appearance',
  },
  borderWidth: {
    label: 'Border Width',
    type: 'number',
    unit: 'px',
    defaultValue: 1,
    category: 'appearance',
  },
  borderTopWidth: {
    label: 'Border Top Width',
    type: 'number',
    unit: 'px',
    defaultValue: 1,
    category: 'appearance',
  },
  borderRightWidth: {
    label: 'Border Right Width',
    type: 'number',
    unit: 'px',
    defaultValue: 1,
    category: 'appearance',
  },
  borderBottomWidth: {
    label: 'Border Bottom Width',
    type: 'number',
    unit: 'px',
    defaultValue: 1,
    category: 'appearance',
  },
  borderLeftWidth: {
    label: 'Border Left Width',
    type: 'number',
    unit: 'px',
    defaultValue: 1,
    category: 'appearance',
  },
  borderStyle: {
    label: 'Border Style',
    type: 'select',
    options: {
      solid: 'Solid',
      dashed: 'Dashed',
      dotted: 'Dotted',
    },
    defaultValue: 'solid',
    category: 'appearance',
  },
  borderTopStyle: {
    label: 'Border Top Style',
    type: 'select',
    options: {
      solid: 'Solid',
      dashed: 'Dashed',
      dotted: 'Dotted',
    },
    defaultValue: 'solid',
    category: 'appearance',
  },
  borderRightStyle: {
    label: 'Border Right Style',
    type: 'select',
    options: {
      solid: 'Solid',
      dashed: 'Dashed',
      dotted: 'Dotted',
    },
    defaultValue: 'solid',
    category: 'appearance',
  },
  borderBottomStyle: {
    label: 'Border Bottom Style',
    type: 'select',
    options: {
      solid: 'Solid',
      dashed: 'Dashed',
      dotted: 'Dotted',
    },
    defaultValue: 'solid',
    category: 'appearance',
  },
  borderLeftStyle: {
    label: 'Border Left Style',
    type: 'select',
    options: {
      solid: 'Solid',
      dashed: 'Dashed',
      dotted: 'Dotted',
    },
    defaultValue: 'solid',
    category: 'appearance',
  },
  borderColor: {
    label: 'Border Color',
    type: 'color',
    defaultValue: '#000000',
    category: 'appearance',
  },
  borderTopColor: {
    label: 'Border Top Color',
    type: 'color',
    defaultValue: '#000000',
    category: 'appearance',
  },
  borderRightColor: {
    label: 'Border Right Color',
    type: 'color',
    defaultValue: '#000000',
    category: 'appearance',
  },
  borderBottomColor: {
    label: 'Border Bottom Color',
    type: 'color',
    defaultValue: '#000000',
    category: 'appearance',
  },
  borderLeftColor: {
    label: 'Border Left Color',
    type: 'color',
    defaultValue: '#000000',
    category: 'appearance',
  },
  padding: {
    label: 'Padding',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'layout',
  },
  paddingTop: {
    label: 'Padding Top',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'layout',
  },
  paddingLeft: {
    label: 'Padding Left',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'layout',
  },
  paddingBottom: {
    label: 'Padding Bottom',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'layout',
  },
  paddingRight: {
    label: 'Padding Right',
    type: 'number',
    unit: 'px',
    defaultValue: 8,
    category: 'layout',
  },
  width: {
    label: 'Width',
    type: 'number',
    unit: 'px',
    defaultValue: 600,
    category: 'layout',
  },
  height: {
    label: 'Height',
    type: 'number',
    unit: 'px',
    defaultValue: 400,
    category: 'layout',
  },
};
