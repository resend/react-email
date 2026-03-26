import type { PanelSectionId } from '@/types/editor/styles';

/**
 * Configuration for which sections are displayed in the sidebar
 * based on the selected element type.
 *
 * Each element type can have:
 * - attributes: Props shown in the Attributes section (always visible)
 * - expandedSections: Sections expanded by default
 * - collapsedSections: Sections collapsed by default (shown with +)
 */

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
  /** Attribute props shown at the top (always visible) */
  attributes: string[];
  /** Section IDs that should be expanded by default */
  expandedSections: SectionId[];
  /** Section IDs that should be collapsed by default (available via +) */
  collapsedSections: SectionId[];
}

/**
 * Default configuration used when nodeType is not found
 */
const DEFAULT_CONFIG: NodeSectionConfig = {
  attributes: [],
  expandedSections: ['alignment'],
  collapsedSections: ['text', 'padding', 'background', 'border'],
};

/**
 * Configuration per element type
 */
const NODE_SECTION_CONFIG: Record<string, NodeSectionConfig> = {
  // Text elements
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

  // Media elements
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

  // Interactive elements
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

  // Code elements
  codeBlock: {
    attributes: ['language', 'theme'],
    expandedSections: [],
    collapsedSections: ['padding', 'border'],
  },

  // Layout elements
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

  // List elements
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

  // Column elements
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

  // Table elements
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

  // Misc elements
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

  // Social links
  socialLinks: {
    attributes: [],
    expandedSections: [],
    collapsedSections: [],
  },

  // Variable element
  variable: {
    attributes: [],
    expandedSections: ['fallback'],
    collapsedSections: [],
  },
};

/**
 * Get section configuration for a node type
 */
export function getNodeSectionConfig(nodeType: string): NodeSectionConfig {
  return NODE_SECTION_CONFIG[nodeType] ?? DEFAULT_CONFIG;
}

/**
 * Section metadata for rendering
 */
interface SectionMeta {
  id: SectionId;
  title: string;
  /** CSS properties this section controls */
  properties: string[];
}

/**
 * Node types where width/height are HTML attributes (not CSS styles)
 * e.g., <img width="100"> vs <button style="width: 100px">
 */
export const SIZE_AS_ATTRIBUTES: string[] = ['image', 'youtube'];

// ---------------------------------------------------------------------------
// Global panel section config (which style sections render per global group)
// ---------------------------------------------------------------------------

/**
 * Maps each global panel group (by PanelSectionId) to the style sections
 * that should be rendered inside it.
 *
 * This is the customisation layer — refine later to support per-field
 * filtering, conditional sections, etc.
 */
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

/**
 * Fallback config used when a group's `id` is not found in the map.
 */
export const DEFAULT_GLOBAL_PANEL_CONFIG: SectionId[] = [];

// ---------------------------------------------------------------------------
// Section metadata for rendering
// ---------------------------------------------------------------------------

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
    properties: [], // dynamic - catches all unsupported properties
  },
  fallback: {
    id: 'fallback',
    title: 'Fallback',
    properties: ['fallback'],
  },
};
