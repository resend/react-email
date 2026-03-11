import { CodeIcon } from 'lucide-react';
import { createMarkBubbleItem } from './create-mark-bubble-item.js';

export const BubbleMenuCode = createMarkBubbleItem({
  name: 'code',
  activeName: 'code',
  command: 'toggleCode',
  icon: <CodeIcon />,
});
