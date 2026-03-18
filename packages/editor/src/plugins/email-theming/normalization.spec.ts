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
      },
      {
        title: 'Container',
        classReference: 'container',
        inputs: [],
      },
      {
        title: 'Typography',
        classReference: 'body',
        inputs: [],
      },
      {
        title: 'Code Block',
        classReference: 'codeBlock',
        inputs: [],
      },
    ]);

    expect(result).toEqual([
      expect.objectContaining({
        id: 'body',
        title: 'Background',
        classReference: 'body',
      }),
      expect.objectContaining({
        id: 'container',
        title: 'Content',
        classReference: 'container',
      }),
      expect.objectContaining({
        id: 'typography',
        title: 'Typography',
        classReference: 'body',
      }),
      expect.objectContaining({
        id: 'code-block',
        title: 'Code Block',
        classReference: 'codeBlock',
      }),
    ]);
  });
});

describe('inferThemeFromPanelStyles', () => {
  it('infers the minimal theme from legacy empty panel groups', () => {
    expect(
      inferThemeFromPanelStyles([
        { title: 'Body', classReference: 'body', inputs: [] },
        { title: 'Container', classReference: 'container', inputs: [] },
      ]),
    ).toBe('minimal');
  });
});
