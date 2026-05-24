import { vi } from 'vitest';
import type { InspectorNodeContext } from '../node';

interface BuildContextOptions {
  nodeType?: string;
  styles?: Record<string, string | number | undefined>;
  attrs?: Record<string, unknown>;
  themeDefaults?: Record<string, string | number | undefined>;
}

/**
 * Builds an `InspectorNodeContext` with vi-mocked callbacks. The `styles`
 * map is mutated by `setStyle` / `batchSetStyle` so a test can assert on
 * the resulting state without inspecting call arguments.
 *
 * Usage:
 *   const ctx = buildInspectorContext({ styles: { paddingTop: 8 } });
 *   render(<PaddingSection {...ctx} />);
 *   // exercise UI...
 *   expect(ctx.setStyle).toHaveBeenCalledWith('paddingTop', 16);
 *   expect(ctx.styles.paddingTop).toBe(16);
 */
export function buildInspectorContext({
  nodeType = 'paragraph',
  styles = {},
  attrs = {},
  themeDefaults = {},
}: BuildContextOptions = {}): InspectorNodeContext & {
  styles: Record<string, string | number | undefined>;
  attrs: Record<string, unknown>;
} {
  const stylesMap = { ...styles };
  const attrsMap = { ...attrs };

  const setStyle = vi.fn((prop: string, value: string | number) => {
    stylesMap[prop] = value;
  });
  const batchSetStyle = vi.fn(
    (changes: Array<{ prop: string; value: string | number }>) => {
      for (const c of changes) stylesMap[c.prop] = c.value;
    },
  );
  const setAttr = vi.fn((name: string, value: unknown) => {
    attrsMap[name] = value;
  });

  return {
    nodeType,
    nodePos: { pos: 0, inside: 0 },
    getStyle: (prop) => stylesMap[prop as string],
    setStyle: setStyle as unknown as InspectorNodeContext['setStyle'],
    batchSetStyle:
      batchSetStyle as unknown as InspectorNodeContext['batchSetStyle'],
    getAttr: (name) => attrsMap[name],
    setAttr,
    themeDefaults,
    presetColors: ['#000000', '#ffffff', '#0670DB'],
    // Expose the mutable maps for assertions.
    styles: stylesMap,
    attrs: attrsMap,
  };
}
