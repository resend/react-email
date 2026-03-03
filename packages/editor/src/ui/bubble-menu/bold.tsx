import { BoldIcon } from 'lucide-react';
import { createPreWiredItem } from './create-pre-wired-item';

export const BubbleMenuBold = createPreWiredItem({
  name: 'bold',
  activeName: 'bold',
  command: 'toggleBold',
  icon: BoldIcon,
});
