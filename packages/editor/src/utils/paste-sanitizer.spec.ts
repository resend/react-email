import { sanitizePastedHtml } from './paste-sanitizer';

describe('sanitizePastedHtml', () => {
  describe('strips dangerous elements from external paste', () => {
    it('removes <script>', () => {
      const out = sanitizePastedHtml('<p>hi</p><script>alert(1)</script>');
      expect(out.toLowerCase()).not.toContain('<script');
    });

    it('removes <iframe>', () => {
      const out = sanitizePastedHtml('<p>hi</p><iframe></iframe>');
      expect(out.toLowerCase()).not.toContain('<iframe');
    });

    it('removes <object> and <embed>', () => {
      const out = sanitizePastedHtml(
        '<object data="x"></object><embed src="x">',
      );
      expect(out.toLowerCase()).not.toContain('<object');
      expect(out.toLowerCase()).not.toContain('<embed');
    });

    it('removes <meta> and <base>', () => {
      const out = sanitizePastedHtml(
        '<meta http-equiv="refresh" content="0;url=https://evil.example"><base href="https://evil.example/">',
      );
      expect(out.toLowerCase()).not.toContain('<meta');
      expect(out.toLowerCase()).not.toContain('<base');
    });
  });

  describe('strips dangerous URL schemes', () => {
    it('removes javascript: from <a href>', () => {
      const out = sanitizePastedHtml('<a href="javascript:alert(1)">click</a>');
      expect(out.toLowerCase()).not.toContain('javascript:');
    });

    it('removes javascript: from <img src>', () => {
      const out = sanitizePastedHtml('<img src="javascript:alert(1)">');
      expect(out.toLowerCase()).not.toContain('javascript:');
    });
  });

  describe('editor-origin fast-path cannot be spoofed to skip sanitization', () => {
    // The fast-path is keyed on a class-name marker in the raw HTML.
    // An attacker can host content carrying that marker so a victim's
    // paste skips sanitization — so the fast-path must not pass
    // dangerous content through untouched.
    it('does not pass through <script> when the editor marker is present', () => {
      const out = sanitizePastedHtml(
        '<div class="paragraph node-paragraph"><script>alert(1)</script></div>',
      );
      expect(out.toLowerCase()).not.toContain('<script');
    });
  });

  describe('preserves legitimate content (regression guards)', () => {
    it('keeps basic semantic HTML', () => {
      const out = sanitizePastedHtml('<p>hello <strong>world</strong></p>');
      expect(out).toContain('<p>');
      expect(out.toLowerCase()).toContain('<strong>');
      expect(out).toContain('hello');
      expect(out).toContain('world');
    });

    it('keeps safe http(s) links with allowed attributes', () => {
      const out = sanitizePastedHtml(
        '<a href="https://example.com" target="_blank" rel="noopener">x</a>',
      );
      expect(out).toContain('href="https://example.com"');
      expect(out).toContain('target="_blank"');
      expect(out).toContain('rel="noopener"');
    });

    it('keeps images with safe src and allowed attributes', () => {
      const out = sanitizePastedHtml(
        '<img src="https://example.com/a.png" alt="a" width="10" height="10">',
      );
      expect(out).toContain('src="https://example.com/a.png"');
      expect(out).toContain('alt="a"');
    });

    it('keeps data:image URLs on <img src>', () => {
      const png =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgAAIAAAUAAen63NgAAAAASUVORK5CYII=';
      const out = sanitizePastedHtml(`<img src="${png}" alt="dot">`);
      expect(out).toContain(`src="${png}"`);
    });

    it('preserves editor-origin attributes (class, style, data-type)', () => {
      // Intra-editor copy/paste relies on these attributes round-tripping
      // so Tiptap can reconstruct the node type and styling.
      const out = sanitizePastedHtml(
        '<div class="node-paragraph" style="color:red" data-type="container">x</div>',
      );
      expect(out).toContain('class="node-paragraph"');
      expect(out).toContain('style="color:red"');
      expect(out).toContain('data-type="container"');
    });
  });
});
