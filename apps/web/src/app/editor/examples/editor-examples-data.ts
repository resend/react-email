export interface EditorExample {
  slug: string;
  title: string;
  description: string;
  docsUrl?: string;
}

export interface EditorExampleSection {
  title: string;
  examples: EditorExample[];
}

export const editorExampleSections: EditorExampleSection[] = [
  {
    title: 'Standalone editor',
    examples: [
      {
        slug: 'standalone-editor',
        title: 'Minimal',
        description:
          'The simplest setup — one component with everything included.',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'standalone-editor-full',
        title: 'Full Features',
        description:
          'Theme switching, ref methods (export, getJSON), and callbacks — all with a single component.',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'standalone-editor-inspector',
        title: 'Inspector',
        description:
          'Add an inspector sidebar alongside the one-line EmailEditor — no manual EditorProvider setup needed.',
        docsUrl: 'https://react.email/docs/editor/features/inspector',
      },
    ],
  },
  {
    title: 'Getting started',
    examples: [
      {
        slug: 'basic-editor',
        title: 'Basic editor',
        description: 'Minimal setup with StarterKit and no UI overlays.',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'bubble-menu',
        title: 'Bubble menu',
        description:
          'Select text to see the default bubble menu with formatting options.',
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        slug: 'slash-commands',
        title: 'Slash commands',
        description:
          'Type / to open the command menu. Includes default commands plus a custom "Greeting" command.',
        docsUrl: 'https://react.email/docs/editor/features/slash-commands',
      },
    ],
  },
  {
    title: 'Intermediate',
    examples: [
      {
        slug: 'custom-bubble-menu',
        title: 'Custom bubble menu',
        description: 'Building bubble menus from primitives.',
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        slug: 'link-editing',
        title: 'Link editing',
        description:
          'Click a link to see the link bubble menu. Select text and press Cmd+K to add links.',
        docsUrl: 'https://react.email/docs/editor/features/link-editing',
      },
      {
        slug: 'column-layouts',
        title: 'Column layouts',
        description: 'Insert multi-column layouts using the toolbar buttons.',
        docsUrl: 'https://react.email/docs/editor/features/column-layouts',
      },
      {
        slug: 'buttons',
        title: 'Buttons',
        description:
          'Click the button to edit its link via the button bubble menu.',
        docsUrl: 'https://react.email/docs/editor/features/buttons',
      },
      {
        slug: 'image-upload',
        title: 'Image upload',
        description:
          'Upload images via paste, drop, or the slash command — with a stubbed uploader and an error-path toggle.',
        docsUrl: 'https://react.email/docs/editor/features/image-upload',
      },
    ],
  },
  {
    title: 'Advanced',
    examples: [
      {
        slug: 'email-theming',
        title: 'Email theming',
        description:
          'Switch between Basic, Minimal, and Custom themes to see how email styles change.',
        docsUrl: 'https://react.email/docs/editor/features/theming',
      },
      {
        slug: 'custom-theme',
        title: 'Custom themes',
        description:
          'Define custom themes with createTheme and extendTheme helpers.',
        docsUrl: 'https://react.email/docs/editor/features/theming',
      },
      {
        slug: 'email-export',
        title: 'Email export',
        description:
          'Edit content and export it as email-ready HTML using composeReactEmail().',
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
      {
        slug: 'custom-extensions',
        title: 'Custom extensions',
        description:
          'A custom Callout node created with EmailNode.create — showing how to extend the editor with email-compatible nodes.',
        docsUrl: 'https://react.email/docs/editor/advanced/custom-extensions',
      },
      {
        slug: 'inspector-defaults',
        title: 'Inspector — defaults',
        description:
          'Zero-config inspector sidebar. All three inspectors render sensible defaults when no children are passed.',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'inspector-composed',
        title: 'Inspector — composed',
        description:
          'Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones.',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'inspector-custom',
        title: 'Inspector — fully custom',
        description:
          'Build the entire inspector UI from scratch using only render-props data and plain HTML.',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'full-email-builder',
        title: 'Full email builder',
        description:
          'All components combined: bubble menus, slash commands, theming, inspector sidebar, and export.',
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
    ],
  },
];

export const editorExampleSlugs = editorExampleSections.flatMap((section) =>
  section.examples.map((example) => example.slug),
);
