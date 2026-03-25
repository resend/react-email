import { describe, expect, it } from 'vitest';
import {
  inferThemeFromPanelStyles,
  normalizeThemePanelStyles,
} from './normalization';

describe('normalizeThemePanelStyles', () => {
  it('maps legacy global panel groups to the current section ids', () => {
    const result = normalizeThemePanelStyles('minimal', [
      {
        title: 'Body',
        classReference: 'body',
        inputs: [],
      } as any,
      {
        title: 'Container',
        classReference: 'container',
        inputs: [],
      } as any,
      {
        title: 'Typography',
        classReference: 'body',
        inputs: [],
      } as any,
      {
        title: 'Code Block',
        classReference: 'codeBlock',
        inputs: [],
      } as any,
    ]);

    expect(result).toEqual([
      expect.objectContaining({
        id: 'body',
        title: 'Background',
      }),
      expect.objectContaining({
        id: 'container',
        title: 'Body',
      }),
      // Legacy 'typography' with classReference 'body' maps to 'body'
      // and is merged — the second 'body' group is kept
      expect.objectContaining({
        id: 'body',
        title: 'Background',
      }),
      expect.objectContaining({
        id: 'codeBlock',
        title: 'Code Block',
      }),
    ]);

    // classReference should be stripped from all groups
    for (const group of result!) {
      expect(group).not.toHaveProperty('classReference');
    }
  });

  it('maps legacy kebab-case section ids to camelCase', () => {
    const result = normalizeThemePanelStyles('minimal', [
      {
        id: 'code-block' as any,
        title: 'Code Block',
        inputs: [],
      },
      {
        id: 'inline-code' as any,
        title: 'Inline Code',
        inputs: [],
      },
    ]);

    expect(result).toEqual([
      expect.objectContaining({ id: 'codeBlock' }),
      expect.objectContaining({ id: 'inlineCode' }),
    ]);
  });

  it('strips classReference from inputs during normalization', () => {
    const result = normalizeThemePanelStyles('basic', [
      {
        id: 'button',
        title: 'Button',
        inputs: [
          {
            label: 'Background',
            type: 'color',
            value: '#000000',
            prop: 'backgroundColor',
            classReference: 'button',
          } as any,
        ],
      },
    ]);

    expect(result![0].inputs[0]).not.toHaveProperty('classReference');
    expect(result![0].inputs[0]).toMatchObject({
      prop: 'backgroundColor',
      value: '#000000',
    });
  });
});

describe('inferThemeFromPanelStyles', () => {
  it('infers the minimal theme from legacy empty panel groups', () => {
    expect(
      inferThemeFromPanelStyles([
        { title: 'Body', inputs: [] },
        { title: 'Container', inputs: [] },
      ]),
    ).toBe('minimal');
  });
});
