import { BoldIcon } from 'lucide-react';
import { createMarkBubbleItem } from './create-mark-bubble-item';

export const BubbleMenuBold = createMarkBubbleItem({
  name: 'bold',
  activeName: 'bold',
  command: 'toggleBold',
  icon: <BoldIcon />,
});
