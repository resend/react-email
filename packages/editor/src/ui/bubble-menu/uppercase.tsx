import { CaseUpperIcon } from 'lucide-react';
import { createPreWiredItem } from './create-pre-wired-item';

export const BubbleMenuUppercase = createPreWiredItem({
  name: 'uppercase',
  activeName: 'uppercase',
  command: 'toggleUppercase',
  icon: CaseUpperIcon,
});
