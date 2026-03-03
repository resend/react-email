import { CodeIcon } from 'lucide-react';
import { createPreWiredItem } from './create-pre-wired-item';

export const BubbleMenuCode = createPreWiredItem({
  name: 'code',
  activeName: 'code',
  command: 'toggleCode',
  icon: CodeIcon,
});
