'use client';

import dynamic from 'next/dynamic';

export const OneLineEditor = dynamic(
  () => import('../_examples/one-line-editor').then((m) => m.OneLineEditor),
  { ssr: false },
);
export const OneLineEditorFull = dynamic(
  () =>
    import('../_examples/one-line-editor-full').then(
      (m) => m.OneLineEditorFull,
    ),
  { ssr: false },
);
export const BasicEditor = dynamic(
  () => import('../_examples/basic-editor').then((m) => m.BasicEditor),
  { ssr: false },
);
export const BubbleMenuExample = dynamic(
  () => import('../_examples/bubble-menu').then((m) => m.BubbleMenuExample),
  { ssr: false },
);
export const SlashCommands = dynamic(
  () => import('../_examples/slash-commands').then((m) => m.SlashCommands),
  { ssr: false },
);
export const CustomBubbleMenu = dynamic(
  () =>
    import('../_examples/custom-bubble-menu').then((m) => m.CustomBubbleMenu),
  { ssr: false },
);
export const LinkEditing = dynamic(
  () => import('../_examples/link-editing').then((m) => m.LinkEditing),
  { ssr: false },
);
export const ColumnLayouts = dynamic(
  () => import('../_examples/column-layouts').then((m) => m.ColumnLayouts),
  { ssr: false },
);
export const Buttons = dynamic(
  () => import('../_examples/images-and-buttons').then((m) => m.Buttons),
  { ssr: false },
);
export const EmailThemingExample = dynamic(
  () =>
    import('../_examples/email-theming').then((m) => m.EmailThemingExample),
  { ssr: false },
);
export const EmailExport = dynamic(
  () => import('../_examples/email-export').then((m) => m.EmailExport),
  { ssr: false },
);
export const CustomExtensions = dynamic(
  () =>
    import('../_examples/custom-extensions').then((m) => m.CustomExtensions),
  { ssr: false },
);
export const InspectorDefaults = dynamic(
  () =>
    import('../_examples/inspector-defaults').then((m) => m.InspectorDefaults),
  { ssr: false },
);
export const InspectorComposed = dynamic(
  () =>
    import('../_examples/inspector-composed').then((m) => m.InspectorComposed),
  { ssr: false },
);
export const InspectorCustom = dynamic(
  () =>
    import('../_examples/inspector-custom').then((m) => m.InspectorCustom),
  { ssr: false },
);
export const FullEmailBuilder = dynamic(
  () =>
    import('../_examples/full-email-builder').then((m) => m.FullEmailBuilder),
  { ssr: false },
);
