import type * as React from 'react';
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
  paragraph: 'Paragraph',
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
    id: 'paragraph',
    title: 'Paragraph',
    category: 'Text',
    classReference: 'paragraph',
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
    id: 'paragraph',
    title: 'Paragraph',
    category: 'Text',
    classReference: 'paragraph',
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

interface HeadingDef {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: number;
  paddingTop?: number;
  color?: string;
}

interface ThemeDef {
  fontFamily: string;
  body: {
    backgroundColor: string;
    color: string;
    fontSize: number;
    lineHeight: number;
  };
  container: {
    backgroundColor: string;
    color: string;
    width: number;
    padding: [number, number, number, number];
    borderRadius: number;
    borderColor: string;
    borderWidth: number;
  };
  h1: HeadingDef;
  h2: HeadingDef;
  h3: HeadingDef;
  paragraph: {
    fontSize: number;
    lineHeight: number;
    color?: string;
  };
  link: {
    color: string;
    textDecoration: 'underline' | 'none';
  };
  image: {
    borderRadius: number;
  };
  button: {
    backgroundColor: string;
    color: string;
    borderRadius: number;
    padding: [number, number, number, number];
    borderColor?: string;
    borderWidth?: number;
    fontWeight?: number;
  };
  codeBlock: {
    backgroundColor: string;
    color: string;
    borderRadius: number;
    padding: [number, number, number, number];
  };
  inlineCode: {
    backgroundColor: string;
    color: string;
    borderRadius: number;
  };
}

function buildThemePanels(def: ThemeDef): PanelGroup[] {
  const [cpTop, cpRight, cpBottom, cpLeft] = def.container.padding;
  const [bpTop, bpRight, bpBottom, bpLeft] = def.button.padding;
  const [cbpTop, cbpRight, cbpBottom, cbpLeft] = def.codeBlock.padding;

  return [
    {
      id: 'body',
      title: 'Background',
      classReference: 'body',
      inputs: [
        {
          label: 'Background',
          type: 'color',
          value: def.body.backgroundColor,
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
          options: { left: 'Left', center: 'Center', right: 'Right' },
          prop: 'align',
          classReference: 'container',
        },
        {
          label: 'Width',
          type: 'number',
          value: def.container.width,
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
          value: def.container.color,
          prop: 'color',
          classReference: 'container',
        },
        {
          label: 'Background',
          type: 'color',
          value: def.container.backgroundColor,
          prop: 'backgroundColor',
          classReference: 'container',
        },
        {
          label: 'Padding Top',
          type: 'number',
          value: cpTop,
          unit: 'px',
          prop: 'paddingTop',
          classReference: 'container',
        },
        {
          label: 'Padding Right',
          type: 'number',
          value: cpRight,
          unit: 'px',
          prop: 'paddingRight',
          classReference: 'container',
        },
        {
          label: 'Padding Bottom',
          type: 'number',
          value: cpBottom,
          unit: 'px',
          prop: 'paddingBottom',
          classReference: 'container',
        },
        {
          label: 'Padding Left',
          type: 'number',
          value: cpLeft,
          unit: 'px',
          prop: 'paddingLeft',
          classReference: 'container',
        },
        {
          label: 'Corner radius',
          type: 'number',
          value: def.container.borderRadius,
          unit: 'px',
          prop: 'borderRadius',
          classReference: 'container',
        },
        {
          label: 'Border color',
          type: 'color',
          value: def.container.borderColor,
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
          value: def.body.fontSize,
          unit: 'px',
          prop: 'fontSize',
          classReference: 'body',
        },
        {
          label: 'Line Height',
          type: 'number',
          value: Math.round(def.body.lineHeight * 100),
          unit: '%',
          prop: 'lineHeight',
          classReference: 'container',
        },
      ],
    },
    { id: 'h1', title: 'Title', category: 'Text', classReference: 'h1', inputs: [] },
    { id: 'h2', title: 'Subtitle', category: 'Text', classReference: 'h2', inputs: [] },
    { id: 'h3', title: 'Heading', category: 'Text', classReference: 'h3', inputs: [] },
    {
      id: 'paragraph',
      title: 'Paragraph',
      category: 'Text',
      classReference: 'paragraph',
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
          value: def.link.color,
          prop: 'color',
          classReference: 'link',
        },
        {
          label: 'Decoration',
          type: 'select',
          value: def.link.textDecoration,
          prop: 'textDecoration',
          options: { underline: 'Underline', none: 'None' },
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
          value: def.image.borderRadius,
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
          value: def.button.backgroundColor,
          prop: 'backgroundColor',
          classReference: 'button',
        },
        {
          label: 'Text color',
          type: 'color',
          value: def.button.color,
          prop: 'color',
          classReference: 'button',
        },
        {
          label: 'Radius',
          type: 'number',
          value: def.button.borderRadius,
          unit: 'px',
          prop: 'borderRadius',
          classReference: 'button',
        },
        {
          label: 'Padding Top',
          type: 'number',
          value: bpTop,
          unit: 'px',
          prop: 'paddingTop',
          classReference: 'button',
        },
        {
          label: 'Padding Right',
          type: 'number',
          value: bpRight,
          unit: 'px',
          prop: 'paddingRight',
          classReference: 'button',
        },
        {
          label: 'Padding Bottom',
          type: 'number',
          value: bpBottom,
          unit: 'px',
          prop: 'paddingBottom',
          classReference: 'button',
        },
        {
          label: 'Padding Left',
          type: 'number',
          value: bpLeft,
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
          value: def.codeBlock.borderRadius,
          unit: 'px',
          prop: 'borderRadius',
          classReference: 'codeBlock',
        },
        {
          label: 'Padding Top',
          type: 'number',
          value: cbpTop,
          unit: 'px',
          prop: 'paddingTop',
          classReference: 'codeBlock',
        },
        {
          label: 'Padding Bottom',
          type: 'number',
          value: cbpBottom,
          unit: 'px',
          prop: 'paddingBottom',
          classReference: 'codeBlock',
        },
        {
          label: 'Padding Left',
          type: 'number',
          value: cbpLeft,
          unit: 'px',
          prop: 'paddingLeft',
          classReference: 'codeBlock',
        },
        {
          label: 'Padding Right',
          type: 'number',
          value: cbpRight,
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
          value: def.inlineCode.backgroundColor,
          prop: 'backgroundColor',
          classReference: 'inlineCode',
        },
        {
          label: 'Text color',
          type: 'color',
          value: def.inlineCode.color,
          prop: 'color',
          classReference: 'inlineCode',
        },
        {
          label: 'Radius',
          type: 'number',
          value: def.inlineCode.borderRadius,
          unit: 'px',
          prop: 'borderRadius',
          classReference: 'inlineCode',
        },
      ],
    },
  ];
}

function px(value: number): string {
  return `${value}px`;
}

function headingReset(h: HeadingDef): React.CSSProperties {
  const style: React.CSSProperties = {
    fontSize: px(h.fontSize),
    lineHeight: String(h.lineHeight),
    fontWeight: h.fontWeight,
  };
  if (h.letterSpacing !== undefined) style.letterSpacing = px(h.letterSpacing);
  if (h.paddingTop !== undefined) style.paddingTop = px(h.paddingTop);
  if (h.color !== undefined) style.color = h.color;
  return style;
}

function buildThemeReset(def: ThemeDef): ResetTheme {
  const paragraph: React.CSSProperties = {
    fontSize: px(def.paragraph.fontSize),
    lineHeight: String(def.paragraph.lineHeight),
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
  };
  if (def.paragraph.color) paragraph.color = def.paragraph.color;

  const button: React.CSSProperties = {
    backgroundColor: def.button.backgroundColor,
    color: def.button.color,
    borderRadius: px(def.button.borderRadius),
    paddingTop: px(def.button.padding[0]),
    paddingRight: px(def.button.padding[1]),
    paddingBottom: px(def.button.padding[2]),
    paddingLeft: px(def.button.padding[3]),
    lineHeight: '100%',
    display: 'inline-block',
  };
  if (def.button.borderColor && def.button.borderWidth) {
    button.border = `${def.button.borderWidth}px solid ${def.button.borderColor}`;
  }
  if (def.button.fontWeight) button.fontWeight = def.button.fontWeight;

  return {
    reset: { margin: '0', padding: '0' },
    body: {
      fontFamily: def.fontFamily,
      fontSize: px(def.body.fontSize),
      lineHeight: String(def.body.lineHeight),
      color: def.body.color,
      minHeight: '100%',
    },
    container: {},
    h1: headingReset(def.h1),
    h2: headingReset(def.h2),
    h3: headingReset(def.h3),
    paragraph,
    list: { paddingLeft: '1.1em', paddingBottom: '1em' },
    nestedList: { paddingLeft: '1.1em', paddingBottom: '0' },
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
      fontFamily: def.fontFamily,
    },
    link: {
      color: def.link.color,
      textDecoration: def.link.textDecoration,
    },
    footer: { fontSize: '0.8em' },
    hr: { paddingBottom: '1em', borderWidth: '2px' },
    image: {
      maxWidth: '100%',
      borderRadius: px(def.image.borderRadius),
    },
    button,
    inlineCode: {
      paddingTop: '0.25em',
      paddingBottom: '0.25em',
      paddingLeft: '0.4em',
      paddingRight: '0.4em',
      background: def.inlineCode.backgroundColor,
      color: def.inlineCode.color,
      borderRadius: px(def.inlineCode.borderRadius),
    },
    codeBlock: {
      fontFamily: 'monospace',
      fontWeight: '500',
      fontSize: '.92em',
      backgroundColor: def.codeBlock.backgroundColor,
      color: def.codeBlock.color,
      borderRadius: px(def.codeBlock.borderRadius),
      paddingTop: px(def.codeBlock.padding[0]),
      paddingRight: px(def.codeBlock.padding[1]),
      paddingBottom: px(def.codeBlock.padding[2]),
      paddingLeft: px(def.codeBlock.padding[3]),
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
}

const SYSTEM_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

const BAREBONE_DEF: ThemeDef = {
  fontFamily: `'Inter', ${SYSTEM_FONT_STACK}`,
  body: {
    backgroundColor: '#F3F4F6',
    color: '#14171E',
    fontSize: 16,
    lineHeight: 1.5,
  },
  container: {
    backgroundColor: '#FFFFFF',
    color: '#14171E',
    width: 640,
    padding: [24, 24, 24, 24],
    borderRadius: 10,
    borderColor: '#F0F0F0',
    borderWidth: 0,
  },
  h1: {
    fontSize: 40,
    lineHeight: 1.1,
    fontWeight: 600,
    letterSpacing: -0.8,
    color: '#14171E',
  },
  h2: {
    fontSize: 32,
    lineHeight: 1.25,
    fontWeight: 600,
    letterSpacing: -0.64,
    color: '#14171E',
  },
  h3: {
    fontSize: 28,
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: -0.56,
    color: '#14171E',
  },
  paragraph: { fontSize: 16, lineHeight: 1.5, color: '#43454B' },
  link: { color: '#14171E', textDecoration: 'underline' },
  image: { borderRadius: 12 },
  button: {
    backgroundColor: '#14171E',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: [16, 28, 16, 28],
    fontWeight: 500,
  },
  codeBlock: {
    backgroundColor: '#F3F4F6',
    color: '#14171E',
    borderRadius: 8,
    padding: [12, 16, 12, 16],
  },
  inlineCode: {
    backgroundColor: '#F3F4F6',
    color: '#14171E',
    borderRadius: 4,
  },
};

const MATTE_DEF: ThemeDef = {
  fontFamily: `Arial, Helvetica, sans-serif`,
  body: {
    backgroundColor: '#FBFCFB',
    color: '#103B05',
    fontSize: 14,
    lineHeight: 1.5,
  },
  container: {
    backgroundColor: '#FFFFFF',
    color: '#103B05',
    width: 640,
    padding: [64, 24, 24, 24],
    borderRadius: 8,
    borderColor: '#D8E1D4',
    borderWidth: 1,
  },
  h1: {
    fontSize: 48,
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: -1.44,
    color: '#103B05',
  },
  h2: {
    fontSize: 32,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: -0.6,
    color: '#103B05',
  },
  h3: {
    fontSize: 20,
    lineHeight: 1.2,
    fontWeight: 500,
    letterSpacing: -0.2,
    color: '#103B05',
  },
  paragraph: { fontSize: 14, lineHeight: 1.5, color: '#194A07' },
  link: { color: '#194A07', textDecoration: 'underline' },
  image: { borderRadius: 0 },
  button: {
    backgroundColor: '#103B05',
    color: '#FBFFF9',
    borderRadius: 0,
    padding: [14, 20, 14, 20],
    fontWeight: 500,
  },
  codeBlock: {
    backgroundColor: '#FBFCFB',
    color: '#103B05',
    borderRadius: 0,
    padding: [12, 16, 12, 16],
  },
  inlineCode: {
    backgroundColor: '#FBFCFB',
    color: '#103B05',
    borderRadius: 0,
  },
};

const PROTOCOL_DEF: ThemeDef = {
  fontFamily: `'Inter', ${SYSTEM_FONT_STACK}`,
  body: {
    backgroundColor: '#212121',
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 1.5,
  },
  container: {
    backgroundColor: '#131313',
    color: '#FFFFFF',
    width: 640,
    padding: [24, 24, 24, 24],
    borderRadius: 0,
    borderColor: '#2B2B2B',
    borderWidth: 0,
  },
  h1: {
    fontSize: 56,
    lineHeight: 1,
    fontWeight: 500,
    letterSpacing: -1.68,
    color: '#FFFFFF',
  },
  h2: {
    fontSize: 32,
    lineHeight: 0.9,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#FFFFFF',
  },
  h3: {
    fontSize: 24,
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: -0.072,
    color: '#FFFFFF',
  },
  paragraph: { fontSize: 14, lineHeight: 1.5, color: '#C4C4C4' },
  link: { color: '#C4C4C4', textDecoration: 'none' },
  image: { borderRadius: 0 },
  button: {
    backgroundColor: '#FFFFFF',
    color: '#131313',
    borderRadius: 0,
    padding: [14, 20, 14, 20],
    fontWeight: 500,
  },
  codeBlock: {
    backgroundColor: '#131313',
    color: '#C4C4C4',
    borderRadius: 0,
    padding: [12, 16, 12, 16],
  },
  inlineCode: {
    backgroundColor: '#2B2B2B',
    color: '#C4C4C4',
    borderRadius: 0,
  },
};

const ARCANE_DEF: ThemeDef = {
  fontFamily: `'Inter', ${SYSTEM_FONT_STACK}`,
  body: {
    backgroundColor: '#FFFFFF',
    color: '#FCF3ED',
    fontSize: 15,
    lineHeight: 1.5,
  },
  container: {
    backgroundColor: '#300610',
    color: '#FCF3ED',
    width: 640,
    padding: [40, 40, 40, 40],
    borderRadius: 0,
    borderColor: '#3D151D',
    borderWidth: 0,
  },
  h1: {
    fontSize: 72,
    lineHeight: 1,
    fontWeight: 400,
    letterSpacing: -0.52,
    color: '#FCF3ED',
  },
  h2: {
    fontSize: 32,
    lineHeight: 1.4,
    fontWeight: 500,
    letterSpacing: 0.008,
    color: '#FCF3ED',
  },
  h3: {
    fontSize: 24,
    lineHeight: 1.4,
    fontWeight: 500,
    letterSpacing: 0.008,
    color: '#FCF3ED',
  },
  paragraph: { fontSize: 15, lineHeight: 1.5, color: '#EFE1D8' },
  link: { color: '#FCF3ED', textDecoration: 'underline' },
  image: { borderRadius: 0 },
  button: {
    backgroundColor: '#FCF3ED',
    color: '#300610',
    borderRadius: 0,
    padding: [14, 20, 14, 20],
    fontWeight: 500,
  },
  codeBlock: {
    backgroundColor: '#431D26',
    color: '#EFE1D8',
    borderRadius: 0,
    padding: [12, 16, 12, 16],
  },
  inlineCode: {
    backgroundColor: '#431D26',
    color: '#EFE1D8',
    borderRadius: 0,
  },
};

const STUDIO_DEF: ThemeDef = {
  fontFamily: `'Inter', ${SYSTEM_FONT_STACK}`,
  body: {
    backgroundColor: '#DCE1E4',
    color: '#332C2C',
    fontSize: 14,
    lineHeight: 1.6,
  },
  container: {
    backgroundColor: '#FFFFFF',
    color: '#332C2C',
    width: 640,
    padding: [32, 32, 32, 32],
    borderRadius: 0,
    borderColor: '#F0F0F0',
    borderWidth: 0,
  },
  h1: {
    fontSize: 48,
    lineHeight: 1.15,
    fontWeight: 700,
    letterSpacing: -0.96,
    color: '#332C2C',
  },
  h2: {
    fontSize: 32,
    lineHeight: 1.2,
    fontWeight: 500,
    letterSpacing: -0.64,
    color: '#332C2C',
  },
  h3: {
    fontSize: 22,
    lineHeight: 1.4,
    fontWeight: 500,
    letterSpacing: -0.176,
    color: '#332C2C',
  },
  paragraph: { fontSize: 14, lineHeight: 1.6, color: '#726A6A' },
  link: { color: '#726A6A', textDecoration: 'none' },
  image: { borderRadius: 0 },
  button: {
    backgroundColor: '#FFFFFF',
    color: '#332C2C',
    borderRadius: 8,
    padding: [12, 20, 12, 20],
    borderColor: '#E8E9E9',
    borderWidth: 1,
    fontWeight: 500,
  },
  codeBlock: {
    backgroundColor: '#F6F6F6',
    color: '#332C2C',
    borderRadius: 8,
    padding: [12, 16, 12, 16],
  },
  inlineCode: {
    backgroundColor: '#F0F0F0',
    color: '#332C2C',
    borderRadius: 4,
  },
};

const THEME_BAREBONE: PanelGroup[] = buildThemePanels(BAREBONE_DEF);
const THEME_MATTE: PanelGroup[] = buildThemePanels(MATTE_DEF);
const THEME_PROTOCOL: PanelGroup[] = buildThemePanels(PROTOCOL_DEF);
const THEME_ARCANE: PanelGroup[] = buildThemePanels(ARCANE_DEF);
const THEME_STUDIO: PanelGroup[] = buildThemePanels(STUDIO_DEF);

const RESET_BAREBONE = buildThemeReset(BAREBONE_DEF);
const RESET_MATTE = buildThemeReset(MATTE_DEF);
const RESET_PROTOCOL = buildThemeReset(PROTOCOL_DEF);
const RESET_ARCANE = buildThemeReset(ARCANE_DEF);
const RESET_STUDIO = buildThemeReset(STUDIO_DEF);

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
  button: RESET_BASIC.button,
  image: RESET_BASIC.image,
  list: RESET_BASIC.list,
  nestedList: RESET_BASIC.nestedList,
  listItem: RESET_BASIC.listItem,
  listParagraph: RESET_BASIC.listParagraph,
};

export const RESET_THEMES: Record<EditorTheme, ResetTheme> = {
  basic: RESET_BASIC,
  minimal: RESET_MINIMAL,
  barebone: RESET_BAREBONE,
  matte: RESET_MATTE,
  protocol: RESET_PROTOCOL,
  arcane: RESET_ARCANE,
  studio: RESET_STUDIO,
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
  barebone: THEME_BAREBONE,
  matte: THEME_MATTE,
  protocol: THEME_PROTOCOL,
  arcane: THEME_ARCANE,
  studio: THEME_STUDIO,
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
