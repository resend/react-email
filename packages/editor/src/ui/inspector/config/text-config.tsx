import type { ElementType } from 'react';
import {
  AlignCenterIcon,
  AlignCenterVerticalIcon,
  AlignEndVerticalIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlignStartVerticalIcon,
  BoldIcon,
  CaseUpperIcon,
  CodeIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from '../../icons';

export interface ParentBlockInfo {
  alignment: string;
  pos: number;
  nodeType: string;
  attrs: Record<string, unknown>;
}

export interface EditorSnapshot {
  isBoldActive: boolean;
  isItalicActive: boolean;
  isUnderlineActive: boolean;
  isStrikeActive: boolean;
  isCodeActive: boolean;
  isUppercaseActive: boolean;
  isBulletListActive: boolean;
  isOrderedListActive: boolean;
  isBlockquoteActive: boolean;
  currentColor: string | undefined;
  parentBlock: ParentBlockInfo;
  blockStyle: Record<string, string | number | undefined>;
}

export const PADDING_KEYS = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
] as const;

export const CSS_UNIT_MAP: Record<string, string> = {
  fontSize: 'px',
  borderWidth: 'px',
  borderRadius: 'px',
  paddingTop: 'px',
  paddingRight: 'px',
  paddingBottom: 'px',
  paddingLeft: 'px',
  lineHeight: '%',
};

export const TEXT_TYPE_OPTIONS = [
  { value: 'title', label: 'Title', nodeType: 'heading', level: 1 },
  { value: 'subtitle', label: 'Subtitle', nodeType: 'heading', level: 2 },
  { value: 'heading', label: 'Heading', nodeType: 'heading', level: 3 },
  { value: 'body', label: 'Body', nodeType: 'paragraph' },
] as const;

export interface FormatItem {
  value: string;
  icon: ElementType;
  iconClassName?: string;
  label: string;
}

export interface AlignmentItem {
  value: string;
  icon: ElementType;
  alternativeIcon?: ElementType;
  iconClassName?: string;
  alternativeIconClassName?: string;
}

export interface ListItem {
  value: string;
  icon: ElementType;
  iconClassName?: string;
  label: string;
}

export const MARK_TOGGLES = [
  {
    value: 'bold',
    active: (s: EditorSnapshot) => s.isBoldActive,
    toggle: 'toggleBold',
  },
  {
    value: 'italic',
    active: (s: EditorSnapshot) => s.isItalicActive,
    toggle: 'toggleItalic',
  },
  {
    value: 'underline',
    active: (s: EditorSnapshot) => s.isUnderlineActive,
    toggle: 'toggleUnderline',
  },
  {
    value: 'line-through',
    active: (s: EditorSnapshot) => s.isStrikeActive,
    toggle: 'toggleStrike',
  },
  {
    value: 'code',
    active: (s: EditorSnapshot) => s.isCodeActive,
    toggle: 'toggleCode',
  },
  {
    value: 'uppercase',
    active: (s: EditorSnapshot) => s.isUppercaseActive,
    toggle: 'toggleUppercase',
  },
  {
    value: 'blockquote',
    active: (s: EditorSnapshot) => s.isBlockquoteActive,
    toggle: 'toggleBlockquote',
  },
] as const;

export const FORMAT_ITEMS: FormatItem[] = [
  { value: 'bold', icon: BoldIcon, label: 'Bold' },
  { value: 'italic', icon: ItalicIcon, label: 'Italic' },
  { value: 'underline', icon: UnderlineIcon, label: 'Underline' },
  { value: 'line-through', icon: StrikethroughIcon, label: 'Strikethrough' },
  { value: 'code', icon: CodeIcon, label: 'Code' },
  { value: 'uppercase', icon: CaseUpperIcon, label: 'Uppercase' },
];

export const ALIGNMENT_ITEMS: AlignmentItem[] = [
  {
    value: 'left',
    alternativeIcon: AlignLeftIcon,
    icon: AlignStartVerticalIcon,
  },
  {
    value: 'center',
    alternativeIcon: AlignCenterIcon,
    icon: AlignCenterVerticalIcon,
  },
  {
    value: 'right',
    alternativeIcon: AlignRightIcon,
    icon: AlignEndVerticalIcon,
  },
];

export const JUSTIFY_AND_LIST_ITEMS: ListItem[] = [
  { value: 'bulletList', icon: ListIcon, label: 'Bullet list' },
  { value: 'orderedList', icon: ListOrderedIcon, label: 'Ordered list' },
];

export const TEXT_DECORATION_ITEMS: FormatItem[] = [
  { value: 'none', icon: () => null, label: 'None' },
  { value: 'underline', icon: UnderlineIcon, label: 'Underline' },
  { value: 'line-through', icon: StrikethroughIcon, label: 'Strikethrough' },
];
