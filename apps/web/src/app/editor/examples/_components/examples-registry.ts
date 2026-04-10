export interface ExampleMeta {
  slug: string;
  title: string;
  description: string;
  section: string;
  docsUrl?: string;
}

export interface ExampleSection {
  title: string;
  examples: ExampleMeta[];
}

export const sections: ExampleSection[] = [
  {
    title: 'One-Line Editor',
    examples: [
      {
        slug: 'one-line-editor',
        title: 'One-Line Editor — Minimal',
        description:
          'The simplest setup — one component with everything included.',
        section: 'One-Line Editor',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'one-line-editor-full',
        title: 'One-Line Editor — Full Features',
        description:
          'Theme switching, ref methods (export, getJSON), and callbacks — all with a single component.',
        section: 'One-Line Editor',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
    ],
  },
  {
    title: 'Getting Started',
    examples: [
      {
        slug: 'basic-editor',
        title: 'Basic Editor',
        description: 'Minimal setup with StarterKit and no UI overlays.',
        section: 'Getting Started',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'bubble-menu',
        title: 'Bubble Menu',
        description:
          'Select text to see the default bubble menu with formatting options.',
        section: 'Getting Started',
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        slug: 'slash-commands',
        title: 'Slash Commands',
        description:
          'Type / to open the command menu. Includes default commands plus a custom "Greeting" command.',
        section: 'Getting Started',
        docsUrl: 'https://react.email/docs/editor/features/slash-commands',
      },
    ],
  },
  {
    title: 'Intermediate',
    examples: [
      {
        slug: 'custom-bubble-menu',
        title: 'Custom Bubble Menu',
        description:
          'Building bubble menus from primitives.',
        section: 'Intermediate',
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        slug: 'link-editing',
        title: 'Link Editing',
        description:
          'Click a link to see the link bubble menu. Select text and press Cmd+K to add links.',
        section: 'Intermediate',
        docsUrl: 'https://react.email/docs/editor/features/link-editing',
      },
      {
        slug: 'column-layouts',
        title: 'Column Layouts',
        description: 'Insert multi-column layouts using the toolbar buttons.',
        section: 'Intermediate',
        docsUrl: 'https://react.email/docs/editor/features/column-layouts',
      },
      {
        slug: 'buttons',
        title: 'Buttons',
        description:
          'Click the button to edit its link via the button bubble menu.',
        section: 'Intermediate',
        docsUrl: 'https://react.email/docs/editor/features/buttons',
      },
    ],
  },
  {
    title: 'Advanced',
    examples: [
      {
        slug: 'email-theming',
        title: 'Email Theming',
        description:
          'Switch between Basic and Minimal themes to see how email styles change.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/features/theming',
      },
      {
        slug: 'email-export',
        title: 'Email Export',
        description:
          'Edit content and export it as email-ready HTML using composeReactEmail().',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
      {
        slug: 'custom-extensions',
        title: 'Custom Extensions',
        description:
          'A custom Callout node created with EmailNode.create — showing how to extend the editor with email-compatible nodes.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/advanced/custom-extensions',
      },
      {
        slug: 'inspector-defaults',
        title: 'Inspector — Defaults',
        description:
          'Zero-config inspector sidebar. All three inspectors render sensible defaults when no children are passed.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'inspector-composed',
        title: 'Inspector — Composed',
        description:
          'Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'inspector-custom',
        title: 'Inspector — Fully Custom',
        description:
          'Build the entire inspector UI from scratch using only render-props data and plain HTML.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'full-email-builder',
        title: 'Full Email Builder',
        description:
          'All components combined: bubble menus, slash commands, theming, inspector sidebar, and export.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
    ],
  },
];

export const allExamples: ExampleMeta[] = sections.flatMap((s) => s.examples);
