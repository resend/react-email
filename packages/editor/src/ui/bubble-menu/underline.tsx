import { UnderlineIcon } from '../icons';
import { createMarkBubbleItem } from './create-mark-bubble-item';

export const BubbleMenuUnderline = createMarkBubbleItem({
  name: 'underline',
  activeName: 'underline',
  command: 'toggleUnderline',
  icon: <UnderlineIcon />,
});
