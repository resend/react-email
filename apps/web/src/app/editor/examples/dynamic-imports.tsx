'use client';

import dynamic from 'next/dynamic';

export const OneLineEditor = dynamic(
  () => import('./one-line-editor/example').then((m) => m.OneLineEditor),
  { ssr: false },
);
export const OneLineEditorFull = dynamic(
  () =>
    import('./one-line-editor-full/example').then(
      (m) => m.OneLineEditorFull,
    ),
  { ssr: false },
);
export const BasicEditor = dynamic(
  () => import('./basic-editor/example').then((m) => m.BasicEditor),
  { ssr: false },
);
export const BubbleMenuExample = dynamic(
  () => import('./bubble-menu/example').then((m) => m.BubbleMenuExample),
  { ssr: false },
);
export const SlashCommands = dynamic(
  () => import('./slash-commands/example').then((m) => m.SlashCommands),
  { ssr: false },
);
export const CustomBubbleMenu = dynamic(
  () =>
    import('./custom-bubble-menu/example').then((m) => m.CustomBubbleMenu),
  { ssr: false },
);
export const LinkEditing = dynamic(
  () => import('./link-editing/example').then((m) => m.LinkEditing),
  { ssr: false },
);
export const ColumnLayouts = dynamic(
  () => import('./column-layouts/example').then((m) => m.ColumnLayouts),
  { ssr: false },
);
export const Buttons = dynamic(
  () => import('./buttons/example').then((m) => m.Buttons),
  { ssr: false },
);
export const EmailThemingExample = dynamic(
  () =>
    import('./email-theming/example').then((m) => m.EmailThemingExample),
  { ssr: false },
);
export const EmailExport = dynamic(
  () => import('./email-export/example').then((m) => m.EmailExport),
  { ssr: false },
);
export const CustomExtensions = dynamic(
  () =>
    import('./custom-extensions/example').then((m) => m.CustomExtensions),
  { ssr: false },
);
export const InspectorDefaults = dynamic(
  () =>
    import('./inspector-defaults/example').then((m) => m.InspectorDefaults),
  { ssr: false },
);
export const InspectorComposed = dynamic(
  () =>
    import('./inspector-composed/example').then((m) => m.InspectorComposed),
  { ssr: false },
);
export const InspectorCustom = dynamic(
  () =>
    import('./inspector-custom/example').then((m) => m.InspectorCustom),
  { ssr: false },
);
export const FullEmailBuilder = dynamic(
  () =>
    import('./full-email-builder/example').then((m) => m.FullEmailBuilder),
  { ssr: false },
);
