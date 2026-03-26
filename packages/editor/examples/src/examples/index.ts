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
