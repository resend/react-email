import type {
  EditorThemes,
  PanelGroup,
  ResetTheme,
  SupportedCssProperties,
} from '@/types/editor/styles';

const THEME_BASIC: PanelGroup[] = [
  {
    title: 'Body',
    classReference: 'body',
    inputs: [],
  },
  {
    title: 'Container',
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
        label: 'Padding Left',
        type: 'number',
        value: 0,
        unit: 'px',
        prop: 'paddingLeft',
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
    ],
  },
  {
    title: 'Typography',
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

const THEME_MINIMAL = THEME_BASIC.map((item) => ({ ...item, inputs: [] }));

const RESET_BASIC: ResetTheme = {
  reset: {
    margin: '0',
    padding: '0',
  },
  body: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '16px',
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
};

export const RESET_THEMES: Record<EditorThemes, ResetTheme> = {
  basic: RESET_BASIC,
  minimal: RESET_MINIMAL,
};

export const EDITOR_THEMES: Record<EditorThemes, PanelGroup[]> = {
  basic: THEME_BASIC,
  minimal: THEME_MINIMAL,
};

/**
 * Use to make the preview nicer once the theme might miss some
 * important properties to make layout accurate
 */
export const PREVIEW_THEME_OVERWRITE: Partial<ResetTheme> = {
  body: {
    color: '#000000',
    fontSize: '14px',
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
  borderColor: {
    label: 'Border Color',
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
