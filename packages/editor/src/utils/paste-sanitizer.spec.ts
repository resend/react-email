import { describe, expect, it } from 'vitest';
import { loadFixture } from '../__tests__/fixtures/load-fixture';
import { sanitizePastedHtml } from './paste-sanitizer';

describe('sanitizePastedHtml', () => {
  describe('editor-origin HTML', () => {
    it('passes through unchanged when a node-* class is present', () => {
      const html =
        '<p class="node-paragraph" style="color:red">Hello</p>';
      expect(sanitizePastedHtml(html)).toBe(html);
    });

    it('detects editor origin even when node-* is not the first class', () => {
      const html =
        '<p class="external node-paragraph" style="color:red">Hello</p>';
      expect(sanitizePastedHtml(html)).toBe(html);
    });
  });

  describe('external HTML — attribute stripping', () => {
    it('strips style and class on plain elements', () => {
      const out = sanitizePastedHtml(
        '<p class="external" style="color:red">Hello</p>',
      );
      expect(out).not.toContain('class=');
      expect(out).not.toContain('style=');
      expect(out).toContain('Hello');
    });

    it('strips data-* attributes', () => {
      const out = sanitizePastedHtml(
        '<p data-track="abc" data-id="1">Hello</p>',
      );
      expect(out).not.toContain('data-');
    });

    it('preserves href, target, rel on <a>', () => {
      const out = sanitizePastedHtml(
        '<a href="https://example.com" target="_blank" rel="noopener" class="x">link</a>',
      );
      expect(out).toContain('href="https://example.com"');
      expect(out).toContain('target="_blank"');
      expect(out).toContain('rel="noopener"');
      expect(out).not.toContain('class=');
    });

    it('preserves src, alt, width, height on <img>', () => {
      const out = sanitizePastedHtml(
        '<img src="https://example.com/x.png" alt="x" width="100" height="50" style="border:1px">',
      );
      expect(out).toContain('src="https://example.com/x.png"');
      expect(out).toContain('alt="x"');
      expect(out).toContain('width="100"');
      expect(out).toContain('height="50"');
      expect(out).not.toContain('style=');
    });

    it('preserves colspan/rowspan on <td>', () => {
      const out = sanitizePastedHtml(
        '<table><tr><td colspan="2" rowspan="3" style="color:red">x</td></tr></table>',
      );
      expect(out).toContain('colspan="2"');
      expect(out).toContain('rowspan="3"');
      expect(out).not.toContain('style=');
    });

    it('preserves border/cellpadding/cellspacing on <table>', () => {
      const out = sanitizePastedHtml(
        '<table border="1" cellpadding="4" cellspacing="0" style="color:red"></table>',
      );
      expect(out).toContain('border="1"');
      expect(out).toContain('cellpadding="4"');
      expect(out).toContain('cellspacing="0"');
    });

    it('preserves id globally', () => {
      const out = sanitizePastedHtml('<div id="anchor" class="x">y</div>');
      expect(out).toContain('id="anchor"');
      expect(out).not.toContain('class=');
    });
  });

  describe('unsafe attributes never leak', () => {
    it('strips inline event handlers like onclick', () => {
      const out = sanitizePastedHtml(
        '<button onclick="alert(1)">click</button>',
      );
      expect(out).not.toMatch(/onclick/i);
    });

    it('strips onerror on <img>', () => {
      const out = sanitizePastedHtml(
        '<img src="https://example.com/x.png" onerror="alert(1)">',
      );
      expect(out).not.toMatch(/onerror/i);
    });

    it('strips srcdoc on <iframe>', () => {
      const out = sanitizePastedHtml(
        '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
      );
      expect(out).not.toMatch(/srcdoc/i);
    });

    it('strips formaction on <button>', () => {
      const out = sanitizePastedHtml(
        '<button formaction="javascript:alert(1)">x</button>',
      );
      expect(out).not.toMatch(/formaction/i);
    });

    it('rejects javascript: URLs in href', () => {
      const out = sanitizePastedHtml(
        '<a href="javascript:alert(1)">x</a>',
      );
      expect(out).not.toMatch(/javascript:/i);
    });

    it('rejects javascript: URLs in src', () => {
      const out = sanitizePastedHtml(
        '<img src="javascript:alert(1)" alt="x">',
      );
      expect(out).not.toMatch(/javascript:/i);
    });
  });

  describe('robustness', () => {
    it('does not throw on empty input', () => {
      expect(() => sanitizePastedHtml('')).not.toThrow();
      expect(sanitizePastedHtml('')).toBe('');
    });

    it('does not throw on malformed HTML', () => {
      expect(() =>
        sanitizePastedHtml('<p><span>unterminated'),
      ).not.toThrow();
    });

    it('handles deeply nested tags', () => {
      const deep = '<div>'.repeat(50) + 'leaf' + '</div>'.repeat(50);
      const out = sanitizePastedHtml(deep);
      expect(out).toContain('leaf');
    });
  });

  describe('paste-source fixtures', () => {
    it.each([
      'word.html',
      'gmail.html',
      'notion.html',
      'vscode.html',
      'apple-mail.html',
      'view-source.html',
    ])('sanitizes %s deterministically', (name) => {
      const html = loadFixture(`paste-sources/${name}`);
      const out = sanitizePastedHtml(html);
      // No style or class survives external paste.
      expect(out).not.toContain('style="');
      expect(out).not.toContain('class="');
      // No data-* attributes survive.
      expect(out).not.toMatch(/\sdata-[a-z-]+=/);
      // No event handlers (on*).
      expect(out).not.toMatch(/\son[a-z]+=/i);
      // No javascript: URLs.
      expect(out).not.toMatch(/javascript:/i);
      // Snapshot locks behavior; update only with a justification.
      expect(out).toMatchSnapshot();
    });
  });
});
