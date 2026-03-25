import { describe, expect, it } from 'vitest';
import {
  type PersistedPanelGroup,
  inferThemeFromPanelStyles,
  normalizeThemePanelStyles,
} from './normalization';

describe('normalizeThemePanelStyles', () => {
  it('maps legacy global panel groups to the current section ids', () => {
    const legacy: PersistedPanelGroup[] = [
      { title: 'Body', classReference: 'body', inputs: [] },
      { title: 'Container', classReference: 'container', inputs: [] },
      { title: 'Typography', classReference: 'body', inputs: [] },
      { title: 'Code Block', classReference: 'codeBlock', inputs: [] },
    ];

    const result = normalizeThemePanelStyles('minimal', legacy);

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
    const legacy: PersistedPanelGroup[] = [
      { id: 'code-block', title: 'Code Block', inputs: [] },
      { id: 'inline-code', title: 'Inline Code', inputs: [] },
    ];

    const result = normalizeThemePanelStyles('minimal', legacy);

    expect(result).toEqual([
      expect.objectContaining({ id: 'codeBlock' }),
      expect.objectContaining({ id: 'inlineCode' }),
    ]);
  });

  it('strips classReference from inputs during normalization', () => {
    const legacy: PersistedPanelGroup[] = [
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
          },
        ],
      },
    ];

    const result = normalizeThemePanelStyles('basic', legacy);

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
