import { describe, expect, it } from 'vitest';
import { isSafeUrl } from './is-safe-url';

describe('isSafeUrl', () => {
  it('allows empty string', () => {
    expect(isSafeUrl('')).toBe(true);
  });

  it('allows hash fragment', () => {
    expect(isSafeUrl('#')).toBe(true);
  });

  it('allows https URLs', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
  });

  it('allows http URLs', () => {
    expect(isSafeUrl('http://example.com')).toBe(true);
  });

  it('allows mailto URLs', () => {
    expect(isSafeUrl('mailto:user@example.com')).toBe(true);
  });

  it('allows tel URLs', () => {
    expect(isSafeUrl('tel:+1234567890')).toBe(true);
  });

  it('rejects javascript: URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects javascript: URLs with leading whitespace', () => {
    expect(isSafeUrl('  javascript:alert(1)')).toBe(false);
  });

  it('rejects javascript: URLs with mixed case', () => {
    expect(isSafeUrl('JavaScript:alert(1)')).toBe(false);
  });

  it('rejects data: URLs', () => {
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('rejects vbscript: URLs', () => {
    expect(isSafeUrl('vbscript:msgbox')).toBe(false);
  });

  it('allows relative paths', () => {
    expect(isSafeUrl('/page/about')).toBe(true);
  });

  it('allows anchor-only fragments', () => {
    expect(isSafeUrl('#section')).toBe(true);
  });
});
