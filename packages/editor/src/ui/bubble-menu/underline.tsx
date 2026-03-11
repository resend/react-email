import { UnderlineIcon } from 'lucide-react';
import { createMarkBubbleItem } from './create-mark-bubble-item.js';

export const BubbleMenuUnderline = createMarkBubbleItem({
  name: 'underline',
  activeName: 'underline',
  command: 'toggleUnderline',
  icon: <UnderlineIcon />,
});
