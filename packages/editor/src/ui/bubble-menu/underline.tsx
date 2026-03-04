import { UnderlineIcon } from 'lucide-react';
import { createMarkBubbleItem } from './create-mark-bubble-item';

export const BubbleMenuUnderline = createMarkBubbleItem({
  name: 'underline',
  activeName: 'underline',
  command: 'toggleUnderline',
  icon: <UnderlineIcon />,
});
