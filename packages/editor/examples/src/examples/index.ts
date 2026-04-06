import { BasicEditor } from './basic-editor';
import { BubbleMenuExample } from './bubble-menu';
import { ColumnLayouts } from './column-layouts';
import { CustomBubbleMenu } from './custom-bubble-menu';
import { CustomExtensions } from './custom-extensions';
import { DocumentInspector } from './document-inspector';
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
  docsUrl?: string;
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
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        id: 'one-line-editor-full',
        label: 'Full Features',
        component: OneLineEditorFull,
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
    ],
  },
  {
    title: 'Getting Started',
    examples: [
      {
        id: 'basic-editor',
        label: 'Basic Editor',
        component: BasicEditor,
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        id: 'bubble-menu',
        label: 'Bubble Menu',
        component: BubbleMenuExample,
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        id: 'slash-commands',
        label: 'Slash Commands',
        component: SlashCommands,
        docsUrl: 'https://react.email/docs/editor/features/slash-commands',
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
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        id: 'link-editing',
        label: 'Link Editing',
        component: LinkEditing,
        docsUrl: 'https://react.email/docs/editor/features/link-editing',
      },
      {
        id: 'column-layouts',
        label: 'Column Layouts',
        component: ColumnLayouts,
        docsUrl: 'https://react.email/docs/editor/features/column-layouts',
      },
      {
        id: 'buttons',
        label: 'Buttons',
        component: Buttons,
        docsUrl: 'https://react.email/docs/editor/features/buttons',
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
        docsUrl: 'https://react.email/docs/editor/features/theming',
      },
      {
        id: 'email-export',
        label: 'Email Export',
        component: EmailExport,
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
      {
        id: 'custom-extensions',
        label: 'Custom Extensions',
        component: CustomExtensions,
        docsUrl: 'https://react.email/docs/editor/advanced/custom-extensions',
      },
      {
        id: 'document-inspector',
        label: 'Document Inspector',
        component: DocumentInspector,
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        id: 'full-email-builder',
        label: 'Full Email Builder',
        component: FullEmailBuilder,
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
    ],
  },
];
