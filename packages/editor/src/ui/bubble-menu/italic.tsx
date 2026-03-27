import { ItalicIcon } from '../icons';
import { createMarkBubbleItem } from './create-mark-bubble-item';

export const BubbleMenuItalic = createMarkBubbleItem({
  name: 'italic',
  activeName: 'italic',
  command: 'toggleItalic',
  icon: <ItalicIcon />,
});
