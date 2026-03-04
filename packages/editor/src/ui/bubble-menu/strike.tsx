import { StrikethroughIcon } from 'lucide-react';
import { createMarkBubbleItem } from './create-mark-bubble-item';

export const BubbleMenuStrike = createMarkBubbleItem({
  name: 'strike',
  activeName: 'strike',
  command: 'toggleStrike',
  icon: <StrikethroughIcon />,
});
