import { StrikethroughIcon } from '../../icons';
import { createMarkBubbleItem } from './create-mark-bubble-item';

export const BubbleMenuStrike = createMarkBubbleItem({
  name: 'strike',
  activeName: 'strike',
  command: 'toggleStrike',
  icon: <StrikethroughIcon />,
});
