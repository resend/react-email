import { describe, expect, it } from 'vitest';
import { decodeHtmlEntities } from './decode-html-entities';

describe('decodeHtmlEntities', () => {
  describe('href attributes', () => {
    it('should decode &amp; in href attributes', () => {
      const input = '<a href="https://example.com?a=1&amp;b=2">Link</a>';
      const expected = '<a href="https://example.com?a=1&b=2">Link</a>';
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should decode multiple &amp; in href', () => {
      const input =
        '<a href="https://example.com?a=1&amp;b=2&amp;c=3">Link</a>';
      const expected = '<a href="https://example.com?a=1&b=2&c=3">Link</a>';
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should handle single quoted href', () => {
      const input = "<a href='https://example.com?a=1&amp;b=2'>Link</a>";
      const expected = "<a href='https://example.com?a=1&b=2'>Link</a>";
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should handle multiple href attributes in document', () => {
      const input = `
        <a href="https://example.com?a=1&amp;b=2">Link 1</a>
        <a href="https://other.com?x=1&amp;y=2">Link 2</a>
      `;
      const expected = `
        <a href="https://example.com?a=1&b=2">Link 1</a>
        <a href="https://other.com?x=1&y=2">Link 2</a>
      `;
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should not affect href without entities', () => {
      const input = '<a href="https://example.com/page">Link</a>';
      expect(decodeHtmlEntities(input)).toBe(input);
    });

    it('should not decode entities in text content', () => {
      const input = '<p>Tom &amp; Jerry</p>';
      expect(decodeHtmlEntities(input)).toBe(input);
    });
  });

  describe('style tags', () => {
    it('should decode &gt; in style tags', () => {
      const input = '<style>.foo{@media (width&gt;=48rem){display:block}}</style>';
      const expected = '<style>.foo{@media (width>=48rem){display:block}}</style>';
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should decode &lt; in style tags', () => {
      const input = '<style>.foo{@media (width&lt;=48rem){display:block}}</style>';
      const expected = '<style>.foo{@media (width<=48rem){display:block}}</style>';
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should decode &amp; in style tags', () => {
      const input = '<style>.a &amp; .b { color: red }</style>';
      const expected = '<style>.a & .b { color: red }</style>';
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should decode multiple entities in style tags', () => {
      const input =
        '<style>.sm_block{@media (width&gt;=40rem){display:block}}.md_block{@media (width&gt;=48rem){display:block}}</style>';
      const expected =
        '<style>.sm_block{@media (width>=40rem){display:block}}.md_block{@media (width>=48rem){display:block}}</style>';
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should handle style tag with attributes', () => {
      const input =
        '<style type="text/css">.foo{@media (width&gt;=48rem){display:block}}</style>';
      const expected =
        '<style type="text/css">.foo{@media (width>=48rem){display:block}}</style>';
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should handle multiple style tags', () => {
      const input = `
        <style>.a{@media (width&gt;=40rem){color:red}}</style>
        <style>.b{@media (width&gt;=48rem){color:blue}}</style>
      `;
      const expected = `
        <style>.a{@media (width>=40rem){color:red}}</style>
        <style>.b{@media (width>=48rem){color:blue}}</style>
      `;
      expect(decodeHtmlEntities(input)).toBe(expected);
    });

    it('should not affect style tags without entities', () => {
      const input = '<style>.foo { color: red; }</style>';
      expect(decodeHtmlEntities(input)).toBe(input);
    });
  });

  describe('combined', () => {
    it('should decode both href and style in same document', () => {
      const input = `
        <html>
          <head>
            <style>.foo{@media (width&gt;=48rem){display:block}}</style>
          </head>
          <body>
            <a href="https://example.com?a=1&amp;b=2">Link</a>
          </body>
        </html>
      `;
      const expected = `
        <html>
          <head>
            <style>.foo{@media (width>=48rem){display:block}}</style>
          </head>
          <body>
            <a href="https://example.com?a=1&b=2">Link</a>
          </body>
        </html>
      `;
      expect(decodeHtmlEntities(input)).toBe(expected);
    });
  });
});
