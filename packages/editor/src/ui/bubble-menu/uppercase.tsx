import { CaseUpperIcon } from 'lucide-react';
import { createMarkBubbleItem } from './create-mark-bubble-item.js';

export const BubbleMenuUppercase = createMarkBubbleItem({
  name: 'uppercase',
  activeName: 'uppercase',
  command: 'toggleUppercase',
  icon: <CaseUpperIcon />,
});
