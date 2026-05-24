import { render } from 'react-email';
import { expect } from 'vitest';

interface SnapshotExtensionRenderArgs {
  /** The extension whose `config.renderToReactEmail` is exercised. */
  extension: {
    name?: string;
    config: { renderToReactEmail?: React.ComponentType<unknown> };
  };
  /** ProseMirror node JSON shape passed as the `node` prop. */
  node: { type: string; attrs?: Record<string, unknown>; content?: unknown[] };
  /** Inline style passed to the rendered component. */
  style?: React.CSSProperties;
  /** Optional children passed to the rendered component (used by marks). */
  children?: React.ReactNode;
}

/**
 * Renders an extension's React Email component to HTML and snapshots it.
 * Mirrors the pattern from extensions/heading.spec.tsx so all extension
 * snapshots stay consistent and reviewable.
 */
export async function snapshotExtensionRender({
  extension,
  node,
  style,
  children,
}: SnapshotExtensionRenderArgs): Promise<void> {
  const Component = extension.config.renderToReactEmail;
  expect(Component).toBeDefined();

  const html = await render(
    // The extension type is loose because each extension declares its own
    // node/mark shape; we only care that `node` and `style` reach it.
    <Component node={node} style={style ?? {}} extension={extension}>
      {children}
    </Component>,
    { pretty: true },
  );

  expect(html).toMatchSnapshot();
}
