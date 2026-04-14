import { ImageIcon } from '../../ui/icons/image';
import type { SlashCommandItem } from '../../ui/slash-command/types';

export const imageSlashCommand: SlashCommandItem = {
  title: 'Image',
  description: 'Upload an image',
  icon: <ImageIcon size={20} />,
  category: 'Layout',
  searchTerms: ['image', 'img', 'picture', 'photo', 'upload'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).run();
    editor.commands.uploadImage();
  },
};
