import { UnderlineIcon } from 'lucide-react';
import { createPreWiredItem } from './create-pre-wired-item';

export const BubbleMenuUnderline = createPreWiredItem({
  name: 'underline',
  activeName: 'underline',
  command: 'toggleUnderline',
  icon: UnderlineIcon,
});
