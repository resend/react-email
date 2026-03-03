import { StrikethroughIcon } from 'lucide-react';
import { createPreWiredItem } from './create-pre-wired-item';

export const BubbleMenuStrike = createPreWiredItem({
  name: 'strike',
  activeName: 'strike',
  command: 'toggleStrike',
  icon: StrikethroughIcon,
});
