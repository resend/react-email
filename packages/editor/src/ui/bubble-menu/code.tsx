import { CodeIcon } from '../icons';
import { createMarkBubbleItem } from './create-mark-bubble-item';

export const BubbleMenuCode = createMarkBubbleItem({
  name: 'code',
  activeName: 'code',
  command: 'toggleCode',
  icon: <CodeIcon />,
});
