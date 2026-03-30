import { BasicEditor } from './basic-editor';
import { BubbleMenuExample } from './bubble-menu';
import { ColumnLayouts } from './column-layouts';
import { CustomBubbleMenu } from './custom-bubble-menu';
import { CustomExtensions } from './custom-extensions';
import { EmailExport } from './email-export';
import { EmailThemingExample } from './email-theming';
import { FullEmailBuilder } from './full-email-builder';
import { Buttons } from './images-and-buttons';
import { LinkEditing } from './link-editing';
import { OneLineEditor } from './one-line-editor';
import { OneLineEditorFull } from './one-line-editor-full';
import { SlashCommands } from './slash-commands';

export interface ExampleItem {
  id: string;
  label: string;
  component: React.ComponentType;
}

export interface ExampleSection {
  title: string;
  examples: ExampleItem[];
}

export const sections: ExampleSection[] = [
  {
    title: 'One-Line Editor',
    examples: [
      {
        id: 'one-line-editor',
        label: 'Minimal',
        component: OneLineEditor,
      },
      {
        id: 'one-line-editor-full',
        label: 'Full Features',
        component: OneLineEditorFull,
      },
    ],
  },
  {
    title: 'Getting Started',
    examples: [
      { id: 'basic-editor', label: 'Basic Editor', component: BasicEditor },
      {
        id: 'bubble-menu',
        label: 'Bubble Menu',
        component: BubbleMenuExample,
      },
      {
        id: 'slash-commands',
        label: 'Slash Commands',
        component: SlashCommands,
      },
    ],
  },
  {
    title: 'Intermediate',
    examples: [
      {
        id: 'custom-bubble-menu',
        label: 'Custom Bubble Menu',
        component: CustomBubbleMenu,
      },
      { id: 'link-editing', label: 'Link Editing', component: LinkEditing },
      {
        id: 'column-layouts',
        label: 'Column Layouts',
        component: ColumnLayouts,
      },
      {
        id: 'buttons',
        label: 'Buttons',
        component: Buttons,
      },
    ],
  },
  {
    title: 'Advanced',
    examples: [
      {
        id: 'email-theming',
        label: 'Email Theming',
        component: EmailThemingExample,
      },
      { id: 'email-export', label: 'Email Export', component: EmailExport },
      {
        id: 'custom-extensions',
        label: 'Custom Extensions',
        component: CustomExtensions,
      },
      {
        id: 'full-email-builder',
        label: 'Full Email Builder',
        component: FullEmailBuilder,
      },
    ],
  },
];
