import { toPlainText } from './to-plain-text';

describe('toPlainText', () => {
  describe('default behavior', () => {
    it('should skip images by default', () => {
      const html =
        '<p>Hello</p><img src="test.jpg" alt="Test Image"><p>World</p>';
      const result = toPlainText(html);

      expect(result).not.toContain('Test Image');
      expect(result).not.toContain('test.jpg');
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('should skip elements with data-skip-in-text="true"', () => {
      const html =
        '<p>Visible</p><span data-skip-in-text="true">Hidden</span><p>Also visible</p>';
      const result = toPlainText(html);

      expect(result).not.toContain('Hidden');
      expect(result).toContain('Visible');
      expect(result).toContain('Also visible');
    });

    it('should format links without brackets', () => {
      const html = '<a href="https://example.com">Click here</a>';
      const result = toPlainText(html);

      expect(result).toContain('Click here');
      expect(result).toContain('https://example.com');
      expect(result).not.toContain('[');
      expect(result).not.toContain(']');
    });

    it('should hide link href if same as text', () => {
      const html = '<a href="https://example.com">https://example.com</a>';
      const result = toPlainText(html);

      expect(result.match(/https:\/\/example\.com/g)?.length).toBe(1);
    });
  });

  describe('custom selectors', () => {
    it('should preserve default img skipping when custom selectors are provided', () => {
      const html =
        '<p>Hello</p><img src="test.jpg" alt="Test Image"><p>World</p>';
      const result = toPlainText(html, {
        selectors: [
          {
            selector: 'p',
            options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
          },
        ],
      });

      expect(result).not.toContain('Test Image');
      expect(result).not.toContain('test.jpg');
    });

    it('should preserve default data-skip-in-text behavior when custom selectors are provided', () => {
      const html = '<p>Visible</p><span data-skip-in-text="true">Hidden</span>';
      const result = toPlainText(html, {
        selectors: [
          {
            selector: 'p',
            options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
          },
        ],
      });

      expect(result).not.toContain('Hidden');
      expect(result).toContain('Visible');
    });

    it('should preserve default link formatting when custom selectors are provided', () => {
      const html = '<p>Text</p><a href="https://example.com">Click here</a>';
      const result = toPlainText(html, {
        selectors: [
          {
            selector: 'p',
            options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
          },
        ],
      });

      expect(result).toContain('Click here');
      expect(result).not.toContain('[');
      expect(result).not.toContain(']');
    });

    it('should allow custom selectors to add new behavior', () => {
      const html = '<p>Normal</p><em>Emphasized text</em>';
      const result = toPlainText(html, {
        selectors: [{ selector: 'em', format: 'skip' }],
      });

      expect(result).toContain('Normal');
      expect(result).not.toContain('Emphasized text');
    });

    it('should apply custom selectors for elements not covered by defaults', () => {
      const html = '<p>Text</p><div class="custom">Custom div</div>';
      const result = toPlainText(html, {
        selectors: [{ selector: 'div.custom', format: 'skip' }],
      });

      expect(result).toContain('Text');
      expect(result).not.toContain('Custom div');
    });
  });
});
