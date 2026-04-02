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
} from 'lucide-react';

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

export const FORMAT_ITEMS = [
  { value: 'bold', icon: <BoldIcon className="size-4" />, label: 'Bold' },
  {
    value: 'italic',
    icon: <ItalicIcon className="size-4" />,
    label: 'Italic',
  },
  {
    value: 'underline',
    icon: <UnderlineIcon className="size-4 translate-y-px" />,
    label: 'Underline',
  },
  {
    value: 'line-through',
    icon: <StrikethroughIcon className="size-4" />,
    label: 'Strikethrough',
  },
  { value: 'code', icon: <CodeIcon className="size-4" />, label: 'Code' },
  {
    value: 'uppercase',
    icon: <CaseUpperIcon className="size-4 translate-y-px" />,
    label: 'Uppercase',
  },
];

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

export const ALIGNMENT_ITEMS = [
  {
    value: 'left',
    alternativeIcon: <AlignLeftIcon className="size-4" />,
    icon: <AlignStartVerticalIcon className="size-4" />,
  },
  {
    value: 'center',
    alternativeIcon: <AlignCenterIcon className="size-4" />,
    icon: <AlignCenterVerticalIcon className="size-4" />,
  },
  {
    value: 'right',
    alternativeIcon: <AlignRightIcon className="size-4" />,
    icon: <AlignEndVerticalIcon className="size-4" />,
  },
];

export const JUSTIFY_AND_LIST_ITEMS = [
  {
    value: 'bulletList',
    icon: <ListIcon className="size-4" />,
    label: 'Bullet list',
  },
  {
    value: 'orderedList',
    icon: <ListOrderedIcon className="size-4" />,
    label: 'Ordered list',
  },
];

export const TEXT_DECORATION_ITEMS = [
  {
    value: 'none',
    icon: <span className="text-xs font-medium">Aa</span>,
    label: 'None',
  },
  {
    value: 'underline',
    icon: <UnderlineIcon className="size-4 translate-y-px" />,
    label: 'Underline',
  },
  {
    value: 'line-through',
    icon: <StrikethroughIcon className="size-4" />,
    label: 'Strikethrough',
  },
];
