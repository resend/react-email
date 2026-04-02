import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { SectionId } from '../config/node-section-config';
import { useCollapsibleSections } from './use-collapsible-sections';

function renderSections(opts: {
  expandedSections?: SectionId[];
  collapsedSections?: SectionId[];
  styleObject?: Record<string, string | number | undefined>;
  attrs?: Record<string, unknown>;
}) {
  return renderHook(
    (props) =>
      useCollapsibleSections({
        expandedSections: props.expandedSections ?? [],
        collapsedSections: props.collapsedSections ?? [],
        styleObject: props.styleObject,
        attrs: props.attrs,
      }),
    { initialProps: opts },
  );
}

describe('allSections', () => {
  it('combines expanded and collapsed sections', () => {
    const { result } = renderSections({
      expandedSections: ['alignment', 'text'],
      collapsedSections: ['padding', 'background'],
    });

    expect(result.current.allSections).toEqual([
      'alignment',
      'text',
      'padding',
      'background',
    ]);
  });

  it('returns empty array when no sections configured', () => {
    const { result } = renderSections({});
    expect(result.current.allSections).toEqual([]);
  });
});

describe('shouldShowSection', () => {
  it('returns true for expanded sections', () => {
    const { result } = renderSections({
      expandedSections: ['alignment', 'text'],
      collapsedSections: ['padding'],
    });

    expect(result.current.shouldShowSection('alignment')).toBe(true);
    expect(result.current.shouldShowSection('text')).toBe(true);
  });

  it('returns false for collapsed sections that have not been added', () => {
    const { result } = renderSections({
      expandedSections: ['alignment'],
      collapsedSections: ['padding', 'background'],
    });

    expect(result.current.shouldShowSection('padding')).toBe(false);
    expect(result.current.shouldShowSection('background')).toBe(false);
  });

  it('returns true for collapsed sections that have been manually added', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding', 'background'],
    });

    act(() => {
      result.current.addSection('padding');
    });

    expect(result.current.shouldShowSection('padding')).toBe(true);
    expect(result.current.shouldShowSection('background')).toBe(false);
  });

  it('returns true for collapsed sections that already have style values', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['background'],
      styleObject: { backgroundColor: '#ff0000' },
    });

    expect(result.current.shouldShowSection('background')).toBe(true);
  });

  it('returns true for collapsed sections that already have attribute values', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['link'],
      attrs: { href: 'https://example.com' },
    });

    expect(result.current.shouldShowSection('link')).toBe(true);
  });

  it('treats empty-string style values as not set', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['background'],
      styleObject: { backgroundColor: '' },
    });

    expect(result.current.shouldShowSection('background')).toBe(false);
  });

  it('treats empty-string attribute values as not set', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['link'],
      attrs: { href: '' },
    });

    expect(result.current.shouldShowSection('link')).toBe(false);
  });

  it('returns false for sections not in either list', () => {
    const { result } = renderSections({
      expandedSections: ['alignment'],
      collapsedSections: ['padding'],
    });

    expect(result.current.shouldShowSection('border')).toBe(false);
  });
});

describe('addSection', () => {
  it('makes a collapsed section visible', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding', 'background'],
    });

    expect(result.current.shouldShowSection('padding')).toBe(false);

    act(() => {
      result.current.addSection('padding');
    });

    expect(result.current.shouldShowSection('padding')).toBe(true);
  });

  it('is idempotent — adding the same section twice is safe', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding'],
    });

    act(() => {
      result.current.addSection('padding');
      result.current.addSection('padding');
    });

    expect(result.current.shouldShowSection('padding')).toBe(true);
  });
});

describe('removeSection', () => {
  it('hides a previously added section', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding'],
    });

    act(() => {
      result.current.addSection('padding');
    });
    expect(result.current.shouldShowSection('padding')).toBe(true);

    act(() => {
      result.current.removeSection('padding');
    });
    expect(result.current.shouldShowSection('padding')).toBe(false);
  });

  it('is a no-op when section was never added', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding'],
    });

    act(() => {
      result.current.removeSection('padding');
    });

    expect(result.current.shouldShowSection('padding')).toBe(false);
  });

  it('does not affect expanded (always-visible) sections', () => {
    const { result } = renderSections({
      expandedSections: ['alignment'],
      collapsedSections: [],
    });

    act(() => {
      result.current.removeSection('alignment');
    });

    expect(result.current.shouldShowSection('alignment')).toBe(true);
  });
});

describe('isRemovable', () => {
  it('returns true for collapsed sections', () => {
    const { result } = renderSections({
      expandedSections: ['alignment'],
      collapsedSections: ['padding', 'background'],
    });

    expect(result.current.isRemovable('padding')).toBe(true);
    expect(result.current.isRemovable('background')).toBe(true);
  });

  it('returns false for expanded sections', () => {
    const { result } = renderSections({
      expandedSections: ['alignment', 'text'],
      collapsedSections: ['padding'],
    });

    expect(result.current.isRemovable('alignment')).toBe(false);
    expect(result.current.isRemovable('text')).toBe(false);
  });
});

describe('getSectionProps', () => {
  it('returns isCollapsed=false for expanded sections', () => {
    const { result } = renderSections({
      expandedSections: ['text'],
      collapsedSections: [],
    });

    const props = result.current.getSectionProps('text');
    expect(props.isCollapsed).toBe(false);
  });

  it('returns isCollapsed=true for collapsed sections with no values', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding'],
    });

    const props = result.current.getSectionProps('padding');
    expect(props.isCollapsed).toBe(true);
  });

  it('returns onRemove=undefined for expanded (non-removable) sections', () => {
    const { result } = renderSections({
      expandedSections: ['text'],
      collapsedSections: [],
    });

    const props = result.current.getSectionProps('text');
    expect(props.onRemove).toBeUndefined();
  });

  it('returns onRemove as a function for collapsed (removable) sections', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding'],
    });

    const props = result.current.getSectionProps('padding');
    expect(typeof props.onRemove).toBe('function');
  });

  it('onAdd expands a collapsed section', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['background'],
    });

    expect(result.current.getSectionProps('background').isCollapsed).toBe(true);

    act(() => {
      result.current.getSectionProps('background').onAdd();
    });

    expect(result.current.getSectionProps('background').isCollapsed).toBe(
      false,
    );
  });

  it('onRemove collapses a manually added section', () => {
    const { result } = renderSections({
      expandedSections: [],
      collapsedSections: ['background'],
    });

    act(() => {
      result.current.addSection('background');
    });
    expect(result.current.getSectionProps('background').isCollapsed).toBe(
      false,
    );

    act(() => {
      result.current.getSectionProps('background').onRemove?.();
    });
    expect(result.current.getSectionProps('background').isCollapsed).toBe(true);
  });
});

describe('config changes', () => {
  it('resets manually added sections when config changes', () => {
    const { result, rerender } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding', 'background'],
    });

    act(() => {
      result.current.addSection('padding');
    });
    expect(result.current.shouldShowSection('padding')).toBe(true);

    rerender({
      expandedSections: ['alignment'],
      collapsedSections: ['border'],
    });

    expect(result.current.shouldShowSection('padding')).toBe(false);
    expect(result.current.shouldShowSection('alignment')).toBe(true);
    expect(result.current.shouldShowSection('border')).toBe(false);
  });

  it('preserves added sections when config stays the same', () => {
    const { result, rerender } = renderSections({
      expandedSections: [],
      collapsedSections: ['padding'],
      styleObject: {},
    });

    act(() => {
      result.current.addSection('padding');
    });
    expect(result.current.shouldShowSection('padding')).toBe(true);

    rerender({
      expandedSections: [],
      collapsedSections: ['padding'],
      styleObject: { color: 'red' },
    });

    expect(result.current.shouldShowSection('padding')).toBe(true);
  });
});

describe('style and attribute reactivity', () => {
  it('auto-shows section when style values appear', () => {
    const { result, rerender } = renderSections({
      expandedSections: [],
      collapsedSections: ['border'],
      styleObject: {},
    });

    expect(result.current.shouldShowSection('border')).toBe(false);

    rerender({
      expandedSections: [],
      collapsedSections: ['border'],
      styleObject: { borderWidth: 2 },
    });

    expect(result.current.shouldShowSection('border')).toBe(true);
  });

  it('auto-hides section when style values are cleared (if not manually added)', () => {
    const { result, rerender } = renderSections({
      expandedSections: [],
      collapsedSections: ['border'],
      styleObject: { borderWidth: 2 },
    });

    expect(result.current.shouldShowSection('border')).toBe(true);

    rerender({
      expandedSections: [],
      collapsedSections: ['border'],
      styleObject: {},
    });

    expect(result.current.shouldShowSection('border')).toBe(false);
  });

  it('keeps section visible after manual add even if style values disappear', () => {
    const { result, rerender } = renderSections({
      expandedSections: [],
      collapsedSections: ['background'],
      styleObject: {},
    });

    act(() => {
      result.current.addSection('background');
    });

    rerender({
      expandedSections: [],
      collapsedSections: ['background'],
      styleObject: {},
    });

    expect(result.current.shouldShowSection('background')).toBe(true);
  });
});
