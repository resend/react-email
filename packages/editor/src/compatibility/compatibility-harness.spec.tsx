import type { Editor, JSONContent } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { legacyReactEmailEditorBoundary } from '../boundary';
import * as coreExports from '../core';
import { composeReactEmail } from '../core';
import * as extensionExports from '../extensions';
import * as rootExports from '../index';
import * as pluginExports from '../plugins';
import * as uiExports from '../ui';
import * as utilExports from '../utils';
import {
  compatibilityFixtures,
  compatibilityImageUrl,
  compatibilityLinkUrl,
} from './fixtures';
import {
  createEditorWithContent,
  destroyEditor,
  expectHtmlContainsInOrder,
} from './test-helpers';

let editor: Editor | null = null;

afterEach(() => {
  destroyEditor(editor);
  editor = null;
});

function createFixtureEditor(
  fixture: (typeof compatibilityFixtures)[keyof typeof compatibilityFixtures],
): Editor {
  editor = createEditorWithContent(
    fixture.content,
    fixture.extraExtensions ?? [],
  );
  return editor;
}

function getFirstNodeOfType(
  content: JSONContent,
  nodeType: string,
): JSONContent | null {
  if (content.type === nodeType) {
    return content;
  }

  for (const child of content.content ?? []) {
    const match = getFirstNodeOfType(child, nodeType);
    if (match) {
      return match;
    }
  }

  return null;
}

function getNodeTypes(content: JSONContent): string[] {
  const types: string[] = [];

  function collect(node: JSONContent): void {
    if (node.type) {
      types.push(node.type);
    }

    for (const child of node.content ?? []) {
      collect(child);
    }
  }

  collect(content);
  return types;
}

function compactHtmlAround(html: string, marker: string): string {
  const markerIndex = html.indexOf(marker);
  expect(markerIndex).toBeGreaterThanOrEqual(0);

  const start = Math.max(0, html.lastIndexOf('<table', markerIndex));
  const endMarker = '</table>';
  const end = html.indexOf(endMarker, markerIndex);

  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThanOrEqual(0);

  return html
    .slice(start, end + endMarker.length)
    .replace(/\s+/g, ' ')
    .trim();
}

describe('Phase 07 editor compatibility fixtures', () => {
  it('preserves simple paragraph JSON shape and email HTML output', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.simpleParagraph);
    const json = ed.getJSON();

    expect(getNodeTypes(json)).toEqual([
      'doc',
      'container',
      'paragraph',
      'text',
    ]);
    expect(getFirstNodeOfType(json, 'paragraph')).toMatchObject({
      type: 'paragraph',
      content: [{ type: 'text', text: 'Simple paragraph fixture.' }],
    });

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expectHtmlContainsInOrder(result.html, [
      '<p',
      'Simple paragraph fixture.',
      '</p>',
    ]);
    expect(result.text).toContain('Simple paragraph fixture.');
  });

  it('preserves heading and paragraph JSON shape and email HTML output', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.headingAndParagraph);
    const json = ed.getJSON();

    expect(getNodeTypes(json)).toEqual([
      'doc',
      'container',
      'heading',
      'text',
      'paragraph',
      'text',
    ]);
    expect(getFirstNodeOfType(json, 'heading')).toMatchObject({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Quarterly Update' }],
    });
    expect(getFirstNodeOfType(json, 'paragraph')).toMatchObject({
      type: 'paragraph',
      content: [{ type: 'text', text: 'A stable paragraph follows.' }],
    });

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expectHtmlContainsInOrder(result.html, [
      '<h2',
      'Quarterly Update',
      '</h2>',
      '<p',
      'A stable paragraph follows.',
      '</p>',
    ]);
    expect(result.text).toContain('QUARTERLY UPDATE');
    expect(result.text).toContain('A stable paragraph follows.');
  });

  it('preserves link mark JSON shape and email HTML output', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.link);
    const linkNode = getFirstNodeOfType(ed.getJSON(), 'text');

    expect(linkNode).toMatchObject({
      type: 'text',
      text: 'Visit example',
      marks: [{ type: 'link', attrs: { href: compatibilityLinkUrl } }],
    });

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toContain('<a');
    expect(result.html).toContain(`href="${compatibilityLinkUrl}"`);
    expect(result.html).toContain('Visit example');
    expect(result.text).toContain('Visit example');
  });

  it('preserves image JSON shape and email HTML output', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.image);
    const imageNode = getFirstNodeOfType(ed.getJSON(), 'image');

    expect(imageNode).toMatchObject({
      type: 'image',
      attrs: {
        src: compatibilityImageUrl,
        alt: 'Asym fixture logo',
        width: '120',
        height: '40',
        alignment: 'center',
      },
    });

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toContain('<img');
    expect(result.html).toContain(`src="${compatibilityImageUrl}"`);
    expect(result.html).toContain('alt="Asym fixture logo"');
    expect(result.html).toContain('width="120"');
    expect(result.html).toContain('height="40"');
  });

  it('preserves button JSON shape and email HTML output', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.button);
    const buttonNode = getFirstNodeOfType(ed.getJSON(), 'button');

    expect(buttonNode).toMatchObject({
      type: 'button',
      attrs: {
        href: compatibilityLinkUrl,
        alignment: 'center',
        class: 'button',
      },
      content: [{ type: 'text', text: 'Donate now' }],
    });

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toContain('<a');
    expect(result.html).toContain(`href="${compatibilityLinkUrl}"`);
    expect(result.html).toContain('Donate now');
    expect(result.text).toContain('Donate now');
  });

  it('preserves two-column layout JSON shape and structure snapshot', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.twoColumnLayout);
    const json = ed.getJSON();

    expect(getNodeTypes(json)).toEqual([
      'doc',
      'container',
      'twoColumns',
      'columnsColumn',
      'paragraph',
      'text',
      'columnsColumn',
      'paragraph',
      'text',
      'paragraph',
    ]);

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expectHtmlContainsInOrder(result.html, ['Column A', 'Column B']);
    expect(compactHtmlAround(result.html, 'Column A')).toMatchInlineSnapshot(
      `"<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"> <tbody style="width:100%"> <tr style="width:100%"> <td data-id="__react-email-column"> <p>Column A</p> </td> <td data-id="__react-email-column"> <p>Column B</p> </td> </tr> </tbody> </table>"`,
    );
  });

  it('preserves table JSON shape and structure snapshot', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.table);
    const json = ed.getJSON();

    expect(getNodeTypes(json)).toEqual([
      'doc',
      'container',
      'table',
      'tableRow',
      'tableCell',
      'paragraph',
      'text',
      'tableCell',
      'paragraph',
      'text',
      'paragraph',
    ]);

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).not.toMatch(/<td[^>]*>\s*<tr/);
    expectHtmlContainsInOrder(result.html, ['<table', 'Gift', '$25.00']);
    expect(compactHtmlAround(result.html, 'Gift')).toMatchInlineSnapshot(
      `"<table align="center" width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-left:auto;margin-right:auto"> <tbody> <tr> <td align="left" data-id="__react-email-column"> <p>Gift</p> </td> <td align="right" data-id="__react-email-column"> <p>$25.00</p> </td> </tr> </tbody> </table>"`,
    );
  });

  it('preserves themed document JSON shape and email serializer styles', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.themedDocument);
    const json = ed.getJSON();

    expect(getFirstNodeOfType(json, 'paragraph')).toMatchObject({
      type: 'paragraph',
      content: [{ type: 'text', text: 'Themed intro copy.' }],
    });
    expect(getFirstNodeOfType(json, 'button')).toMatchObject({
      type: 'button',
      content: [{ type: 'text', text: 'Open report' }],
    });

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );
    expect(themeStyleTag?.textContent).toContain('background-color:#f4f4f5;');

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toContain('Themed intro copy.');
    expect(result.html).toContain('Open report');
    expect(result.html).toMatch(/background-color:\s*#0670DB/i);
    expect(result.html).toMatch(/display:\s*inline-block/i);
  });

  it('preserves custom EmailNode registration and composeReactEmail output', async () => {
    const ed = createFixtureEditor(compatibilityFixtures.customCallout);
    const json = ed.getJSON();

    expect(
      ed.extensionManager.extensions.some(
        (extension) => extension.name === 'callout',
      ),
    ).toBe(true);
    expect(getFirstNodeOfType(json, 'callout')).toMatchObject({
      type: 'callout',
      content: [{ type: 'text', text: 'Custom extension content.' }],
    });

    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toContain('Before callout.');
    expect(result.html).toContain('Custom extension content.');
    expect(result.html).toMatch(/border-left:\s*3px solid #1c1c1c/i);
  });

  it('keeps public export groups and CSS surfaces represented', async () => {
    expect(rootExports.EmailEditor).toBeDefined();
    expect(coreExports.composeReactEmail).toBeDefined();
    expect(coreExports.EmailNode).toBeDefined();
    expect(coreExports.EmailMark).toBeDefined();
    expect(extensionExports.StarterKit).toBeDefined();
    expect(extensionExports.Button).toBeDefined();
    expect(extensionExports.Table).toBeDefined();
    expect(pluginExports.EmailTheming).toBeDefined();
    expect(pluginExports.useEditorImage).toBeDefined();
    expect(uiExports.BubbleMenu).toBeDefined();
    expect(uiExports.Inspector).toBeDefined();
    expect(uiExports.SlashCommand).toBeDefined();
    expect(utilExports.setTextAlignment).toBeDefined();

    expect(legacyReactEmailEditorBoundary.publicExportSubpaths).toEqual([
      '.',
      './core',
      './extensions',
      './plugins',
      './ui',
      './utils',
    ]);
    expect(legacyReactEmailEditorBoundary.cssExportSubpaths).toEqual([
      './styles/bubble-menu.css',
      './styles/button-bubble-menu.css',
      './styles/image-bubble-menu.css',
      './styles/inspector.css',
      './styles/link-bubble-menu.css',
      './styles/slash-command.css',
      './themes/default.css',
    ]);
  });
});
