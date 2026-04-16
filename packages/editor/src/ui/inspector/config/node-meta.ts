import type { ElementType } from 'react';
import {
  BoxIcon,
  CodeIcon,
  Heading1Icon,
  ImageIcon,
  LayoutIcon,
  LinkIcon,
  ListIcon,
  MinusIcon,
  MousePointerClickIcon,
  SquareRoundCornerIcon,
  TableIcon,
  TextQuoteIcon,
  TypeIcon,
} from '../../icons';

interface NodeMeta {
  icon: ElementType;
  label: string;
}

const NODE_META: Record<string, NodeMeta> = {
  paragraph: { icon: TypeIcon, label: 'Text' },
  heading: { icon: Heading1Icon, label: 'Heading' },
  image: { icon: ImageIcon, label: 'Image' },
  button: { icon: MousePointerClickIcon, label: 'Button' },
  link: { icon: LinkIcon, label: 'Link' },
  codeBlock: { icon: CodeIcon, label: 'Code Block' },
  section: { icon: LayoutIcon, label: 'Section' },
  div: { icon: BoxIcon, label: 'Container' },
  footer: { icon: BoxIcon, label: 'Footer' },
  blockquote: { icon: TextQuoteIcon, label: 'Blockquote' },
  bulletList: { icon: ListIcon, label: 'Bullet List' },
  orderedList: { icon: ListIcon, label: 'Ordered List' },
  listItem: { icon: MinusIcon, label: 'List Item' },
  table: { icon: TableIcon, label: 'Table' },
  tableRow: { icon: MinusIcon, label: 'Table Row' },
  tableCell: { icon: BoxIcon, label: 'Table Cell' },
  tableHeader: { icon: BoxIcon, label: 'Table Header' },
  horizontalRule: { icon: MinusIcon, label: 'Divider' },
  global: { icon: SquareRoundCornerIcon, label: 'Layout' },
};

const DEFAULT_NODE_META: NodeMeta = { icon: BoxIcon, label: 'Element' };

export function getNodeMeta(nodeType: string): NodeMeta {
  return NODE_META[nodeType] ?? DEFAULT_NODE_META;
}
