import { describe, expect, it } from 'vitest';
import { sanitizePastedHtml } from './paste-sanitizer';

describe('sanitizePastedHtml', () => {
  it('passes through editor content unchanged', () => {
    const html = '<p class="node-paragraph">Hello</p>';
    expect(sanitizePastedHtml(html)).toBe(html);
  });

  it('preserves safe href on links', () => {
    const html = '<a href="https://example.com">Link</a>';
    const result = sanitizePastedHtml(html);
    expect(result).toContain('href="https://example.com"');
  });

  it('strips javascript: href from links', () => {
    const html = '<a href="javascript:alert(1)">Click me</a>';
    const result = sanitizePastedHtml(html);
    expect(result).not.toContain('javascript:');
    expect(result).toContain('>Click me</a>');
  });

  it('strips data: href from links', () => {
    const html = '<a href="data:text/html,<script>alert(1)</script>">Bad</a>';
    const result = sanitizePastedHtml(html);
    expect(result).not.toContain('data:');
  });

  it('strips vbscript: href from links', () => {
    const html = '<a href="vbscript:msgbox">Bad</a>';
    const result = sanitizePastedHtml(html);
    expect(result).not.toContain('vbscript:');
  });

  it('strips javascript: src from images', () => {
    const html = '<img src="javascript:alert(1)" alt="bad">';
    const result = sanitizePastedHtml(html);
    expect(result).not.toContain('javascript:');
    expect(result).toContain('alt="bad"');
  });

  it('preserves safe src on images', () => {
    const html = '<img src="https://example.com/img.png" alt="good">';
    const result = sanitizePastedHtml(html);
    expect(result).toContain('src="https://example.com/img.png"');
  });

  it('strips data: src from images', () => {
    const html = '<img src="data:image/svg+xml,<svg></svg>" alt="bad">';
    const result = sanitizePastedHtml(html);
    expect(result).not.toContain('data:');
  });

  it('preserves mailto: href on links', () => {
    const html = '<a href="mailto:user@example.com">Email</a>';
    const result = sanitizePastedHtml(html);
    expect(result).toContain('href="mailto:user@example.com"');
  });
});
