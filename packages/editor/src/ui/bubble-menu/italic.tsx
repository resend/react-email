import { ItalicIcon } from 'lucide-react';
import { createMarkBubbleItem } from './create-mark-bubble-item.js';

export const BubbleMenuItalic = createMarkBubbleItem({
  name: 'italic',
  activeName: 'italic',
  command: 'toggleItalic',
  icon: <ItalicIcon />,
});
