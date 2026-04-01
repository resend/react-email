import { CaseUpperIcon } from '../icons';
import { createMarkBubbleItem } from './create-mark-bubble-item';

export const BubbleMenuUppercase = createMarkBubbleItem({
  name: 'uppercase',
  activeName: 'uppercase',
  command: 'toggleUppercase',
  icon: <CaseUpperIcon />,
});
