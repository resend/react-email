import { BasicEditor } from './basic-editor';
import { BubbleMenuExample } from './bubble-menu';
import { ColumnLayouts } from './column-layouts';
import { CustomBubbleMenu } from './custom-bubble-menu';
import { CustomExtensions } from './custom-extensions';
import { EmailExport } from './email-export';
import { EmailThemingExample } from './email-theming';
import { FullEmailBuilder } from './full-email-builder';
import { Buttons } from './images-and-buttons';
import { InspectorComposed } from './inspector-composed';
import { InspectorCustom } from './inspector-custom';
import { InspectorDefaults } from './inspector-defaults';
import { LinkEditing } from './link-editing';
import { OneLineEditor } from './one-line-editor';
import { OneLineEditorFull } from './one-line-editor-full';
import { SlashCommands } from './slash-commands';

import basicEditorSource from './basic-editor.tsx?raw';
import bubbleMenuSource from './bubble-menu.tsx?raw';
import columnLayoutsSource from './column-layouts.tsx?raw';
import customBubbleMenuSource from './custom-bubble-menu.tsx?raw';
import customExtensionsSource from './custom-extensions.tsx?raw';
import emailExportSource from './email-export.tsx?raw';
import emailThemingSource from './email-theming.tsx?raw';
import fullEmailBuilderSource from './full-email-builder.tsx?raw';
import buttonsSource from './images-and-buttons.tsx?raw';
import inspectorComposedSource from './inspector-composed.tsx?raw';
import inspectorCustomSource from './inspector-custom.tsx?raw';
import inspectorDefaultsSource from './inspector-defaults.tsx?raw';
import linkEditingSource from './link-editing.tsx?raw';
import oneLineEditorSource from './one-line-editor.tsx?raw';
import oneLineEditorFullSource from './one-line-editor-full.tsx?raw';
import slashCommandsSource from './slash-commands.tsx?raw';

export interface ExampleItem {
  id: string;
  label: string;
  component: React.ComponentType;
  sourceCode: string;
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
        sourceCode: oneLineEditorSource,
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        id: 'one-line-editor-full',
        label: 'Full Features',
        component: OneLineEditorFull,
        sourceCode: oneLineEditorFullSource,
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
        sourceCode: basicEditorSource,
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        id: 'bubble-menu',
        label: 'Bubble Menu',
        component: BubbleMenuExample,
        sourceCode: bubbleMenuSource,
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        id: 'slash-commands',
        label: 'Slash Commands',
        component: SlashCommands,
        sourceCode: slashCommandsSource,
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
        sourceCode: customBubbleMenuSource,
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        id: 'link-editing',
        label: 'Link Editing',
        component: LinkEditing,
        sourceCode: linkEditingSource,
        docsUrl: 'https://react.email/docs/editor/features/link-editing',
      },
      {
        id: 'column-layouts',
        label: 'Column Layouts',
        component: ColumnLayouts,
        sourceCode: columnLayoutsSource,
        docsUrl: 'https://react.email/docs/editor/features/column-layouts',
      },
      {
        id: 'buttons',
        label: 'Buttons',
        component: Buttons,
        sourceCode: buttonsSource,
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
        sourceCode: emailThemingSource,
        docsUrl: 'https://react.email/docs/editor/features/theming',
      },
      {
        id: 'email-export',
        label: 'Email Export',
        component: EmailExport,
        sourceCode: emailExportSource,
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
      {
        id: 'custom-extensions',
        label: 'Custom Extensions',
        component: CustomExtensions,
        sourceCode: customExtensionsSource,
        docsUrl: 'https://react.email/docs/editor/advanced/custom-extensions',
      },
      {
        id: 'inspector-defaults',
        label: 'Inspector — Defaults',
        component: InspectorDefaults,
        sourceCode: inspectorDefaultsSource,
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        id: 'inspector-composed',
        label: 'Inspector — Composed',
        component: InspectorComposed,
        sourceCode: inspectorComposedSource,
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        id: 'inspector-custom',
        label: 'Inspector — Custom',
        component: InspectorCustom,
        sourceCode: inspectorCustomSource,
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        id: 'full-email-builder',
        label: 'Full Email Builder',
        component: FullEmailBuilder,
        sourceCode: fullEmailBuilderSource,
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
    ],
  },
];
