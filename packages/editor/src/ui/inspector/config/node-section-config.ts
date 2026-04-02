import type { PanelSectionId } from '../../../plugins/email-theming/types';

export type SectionId =
  | 'alignment'
  | 'text'
  | 'size'
  | 'padding'
  | 'background'
  | 'border'
  | 'link'
  | 'otherStyles'
  | 'fallback';

interface NodeSectionConfig {
  attributes: string[];
  expandedSections: SectionId[];
  collapsedSections: SectionId[];
}

const DEFAULT_CONFIG: NodeSectionConfig = {
  attributes: [],
  expandedSections: ['alignment'],
  collapsedSections: ['text', 'padding', 'background', 'border'],
};

const NODE_SECTION_CONFIG: Record<string, NodeSectionConfig> = {
  paragraph: {
    attributes: [],
    expandedSections: ['alignment', 'text'],
    collapsedSections: ['padding', 'background', 'border'],
  },
  heading: {
    attributes: ['level'],
    expandedSections: ['alignment', 'text'],
    collapsedSections: ['padding', 'background', 'border'],
  },
  blockquote: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['text', 'padding', 'background', 'border'],
  },
  image: {
    attributes: ['src', 'alt'],
    expandedSections: ['alignment', 'size'],
    collapsedSections: ['link', 'padding', 'border'],
  },
  youtube: {
    attributes: [],
    expandedSections: ['alignment', 'size'],
    collapsedSections: ['padding'],
  },
  button: {
    attributes: [],
    expandedSections: ['alignment', 'link', 'text'],
    collapsedSections: ['size', 'padding', 'border', 'background'],
  },
  link: {
    attributes: ['href'],
    expandedSections: ['text'],
    collapsedSections: ['border'],
  },
  codeBlock: {
    attributes: ['language', 'theme'],
    expandedSections: [],
    collapsedSections: ['padding', 'border'],
  },
  section: {
    attributes: [],
    expandedSections: ['background'],
    collapsedSections: ['padding', 'border'],
  },
  div: {
    attributes: [],
    expandedSections: ['background'],
    collapsedSections: ['padding', 'border'],
  },
  footer: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['text', 'padding', 'background'],
  },
  bulletList: {
    attributes: [],
    expandedSections: ['alignment', 'text'],
    collapsedSections: ['padding', 'border'],
  },
  orderedList: {
    attributes: [],
    expandedSections: ['alignment'],
    collapsedSections: ['padding', 'border'],
  },
  listItem: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['padding', 'border'],
  },
  twoColumns: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['padding', 'background', 'border'],
  },
  threeColumns: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['padding', 'background', 'border'],
  },
  fourColumns: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['padding', 'background', 'border'],
  },
  columnsColumn: {
    attributes: [],
    expandedSections: ['size'],
    collapsedSections: ['padding', 'background', 'border'],
  },
  table: {
    attributes: [],
    expandedSections: ['alignment'],
    collapsedSections: ['padding', 'border'],
  },
  tableRow: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['padding', 'background', 'border'],
  },
  tableCell: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['padding', 'background', 'border'],
  },
  tableHeader: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['padding', 'background', 'border'],
  },
  horizontalRule: {
    attributes: [],
    expandedSections: [],
    collapsedSections: ['padding'],
  },
  twitter: {
    attributes: [],
    expandedSections: ['alignment'],
    collapsedSections: ['padding'],
  },
  socialLinks: {
    attributes: [],
    expandedSections: [],
    collapsedSections: [],
  },
  variable: {
    attributes: [],
    expandedSections: ['fallback'],
    collapsedSections: [],
  },
};

export function getNodeSectionConfig(nodeType: string): NodeSectionConfig {
  return NODE_SECTION_CONFIG[nodeType] ?? DEFAULT_CONFIG;
}

interface SectionMeta {
  id: SectionId;
  title: string;
  properties: string[];
}

export const SIZE_AS_ATTRIBUTES: string[] = ['image', 'youtube'];

export const GLOBAL_SECTION_CONFIG: Record<PanelSectionId, SectionId[]> = {
  body: ['background', 'padding'],
  container: ['background', 'alignment', 'padding', 'size', 'border'],
  typography: ['text'],
  link: ['text'],
  image: ['border'],
  button: ['text', 'padding', 'background', 'border'],
  'code-block': ['padding', 'border'],
  'inline-code': ['text', 'background', 'border'],
};

export const DEFAULT_GLOBAL_PANEL_CONFIG: SectionId[] = [];

export const SECTION_METADATA: Record<SectionId, SectionMeta> = {
  alignment: {
    id: 'alignment',
    title: 'Alignment',
    properties: ['align', 'alignment'],
  },
  text: {
    id: 'text',
    title: 'Text',
    properties: [
      'color',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'textDecoration',
    ],
  },
  size: {
    id: 'size',
    title: 'Size',
    properties: ['width', 'height'],
  },
  padding: {
    id: 'padding',
    title: 'Padding',
    properties: [
      'padding',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
    ],
  },
  background: {
    id: 'background',
    title: 'Background',
    properties: ['backgroundColor'],
  },
  border: {
    id: 'border',
    title: 'Border',
    properties: ['borderRadius', 'borderWidth', 'borderColor', 'borderStyle'],
  },
  link: {
    id: 'link',
    title: 'Link',
    properties: ['href'],
  },
  otherStyles: {
    id: 'otherStyles',
    title: 'Other Styles',
    properties: [],
  },
  fallback: {
    id: 'fallback',
    title: 'Fallback',
    properties: ['fallback'],
  },
};
