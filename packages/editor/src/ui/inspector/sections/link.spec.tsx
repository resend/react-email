import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LinkSection } from './link';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('LinkSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders nothing when no link mark is active', () => {
    const setLinkColor = vi.fn();
    const { container } = render(
      <LinkSection
        linkHref=""
        linkColor=""
        setLinkColor={setLinkColor}
        isLinkActive={false}
        presetColors={[]}
      />,
    );
    expect(container.textContent).toBe('');
  });

  it('renders URL and Color rows when a link is active', () => {
    const setLinkColor = vi.fn();
    const { container } = render(
      <LinkSection
        linkHref="https://example.com"
        linkColor="#0670DB"
        setLinkColor={setLinkColor}
        isLinkActive={true}
        presetColors={[]}
      />,
    );
    expect(container.textContent).toContain('Link');
    expect(container.textContent).toContain('URL');
    expect(container.textContent).toContain('Color');
  });

  it('color change is forwarded to setLinkColor', () => {
    const setLinkColor = vi.fn();
    render(
      <LinkSection
        linkHref="https://example.com"
        linkColor="#000000"
        setLinkColor={setLinkColor}
        isLinkActive={true}
        presetColors={[]}
      />,
    );
    setLinkColor('#ff0000');
    expect(setLinkColor).toHaveBeenCalledWith('#ff0000');
  });
});
