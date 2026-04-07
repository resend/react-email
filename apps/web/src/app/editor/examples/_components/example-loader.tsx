'use client';

import dynamic from 'next/dynamic';

const exampleComponents: Record<string, ReturnType<typeof dynamic>> = {
  'one-line-editor': dynamic(
    () => import('../_examples/one-line-editor').then((m) => m.OneLineEditor),
    { ssr: false },
  ),
  'one-line-editor-full': dynamic(
    () =>
      import('../_examples/one-line-editor-full').then(
        (m) => m.OneLineEditorFull,
      ),
    { ssr: false },
  ),
  'basic-editor': dynamic(
    () => import('../_examples/basic-editor').then((m) => m.BasicEditor),
    { ssr: false },
  ),
  'bubble-menu': dynamic(
    () => import('../_examples/bubble-menu').then((m) => m.BubbleMenuExample),
    { ssr: false },
  ),
  'slash-commands': dynamic(
    () => import('../_examples/slash-commands').then((m) => m.SlashCommands),
    { ssr: false },
  ),
  'custom-bubble-menu': dynamic(
    () =>
      import('../_examples/custom-bubble-menu').then((m) => m.CustomBubbleMenu),
    { ssr: false },
  ),
  'link-editing': dynamic(
    () => import('../_examples/link-editing').then((m) => m.LinkEditing),
    { ssr: false },
  ),
  'column-layouts': dynamic(
    () => import('../_examples/column-layouts').then((m) => m.ColumnLayouts),
    { ssr: false },
  ),
  buttons: dynamic(
    () => import('../_examples/images-and-buttons').then((m) => m.Buttons),
    { ssr: false },
  ),
  'email-theming': dynamic(
    () =>
      import('../_examples/email-theming').then((m) => m.EmailThemingExample),
    { ssr: false },
  ),
  'email-export': dynamic(
    () => import('../_examples/email-export').then((m) => m.EmailExport),
    { ssr: false },
  ),
  'custom-extensions': dynamic(
    () =>
      import('../_examples/custom-extensions').then((m) => m.CustomExtensions),
    { ssr: false },
  ),
  'inspector-defaults': dynamic(
    () =>
      import('../_examples/inspector-defaults').then(
        (m) => m.InspectorDefaults,
      ),
    { ssr: false },
  ),
  'inspector-composed': dynamic(
    () =>
      import('../_examples/inspector-composed').then(
        (m) => m.InspectorComposed,
      ),
    { ssr: false },
  ),
  'inspector-custom': dynamic(
    () =>
      import('../_examples/inspector-custom').then((m) => m.InspectorCustom),
    { ssr: false },
  ),
  'full-email-builder': dynamic(
    () =>
      import('../_examples/full-email-builder').then((m) => m.FullEmailBuilder),
    { ssr: false },
  ),
};

export function ExampleLoader({ slug }: { slug: string }) {
  const ExampleComponent = exampleComponents[slug];
  if (!ExampleComponent) return null;
  return <ExampleComponent />;
}
