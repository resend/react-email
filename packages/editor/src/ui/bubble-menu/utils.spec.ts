import { focusEditor, getUrlFromString, setLinkHref } from './utils.js';

describe('getUrlFromString', () => {
  it('returns hash as-is', () => {
    expect(getUrlFromString('#')).toBe('#');
  });

  it('returns valid https URLs as-is', () => {
    expect(getUrlFromString('https://example.com')).toBe('https://example.com');
  });

  it('returns valid http URLs as-is', () => {
    expect(getUrlFromString('http://example.com')).toBe('http://example.com');
  });

  it('returns mailto URLs as-is', () => {
    expect(getUrlFromString('mailto:user@example.com')).toBe(
      'mailto:user@example.com',
    );
  });

  it('returns tel URLs as-is', () => {
    expect(getUrlFromString('tel:+1234567890')).toBe('tel:+1234567890');
  });

  it('rejects javascript: URLs', () => {
    expect(getUrlFromString('javascript:alert(1)')).toBeNull();
  });

  it('rejects data: URLs', () => {
    expect(
      getUrlFromString('data:text/html,<script>alert(1)</script>'),
    ).toBeNull();
  });

  it('rejects vbscript: URLs', () => {
    expect(getUrlFromString('vbscript:msgbox')).toBeNull();
  });

  it('auto-prefixes URLs with dots', () => {
    const result = getUrlFromString('example.com');
    expect(result).toBe('https://example.com/');
  });

  it('returns null for invalid strings', () => {
    expect(getUrlFromString('not a url')).toBeNull();
  });

  it('returns null for strings without dots', () => {
    expect(getUrlFromString('justtext')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getUrlFromString('')).toBeNull();
  });
});

describe('setLinkHref', () => {
  function createMockEditor({
    from = 0,
    to = 0,
  }: {
    from?: number;
    to?: number;
  } = {}) {
    const run = vi.fn();
    const setTextSelection = vi.fn(() => ({ run }));
    const setLink = vi.fn(() => ({ run, setTextSelection }));
    const extendMarkRange = vi.fn(() => ({ setLink }));
    const unsetLink = vi.fn(() => ({ run }));
    const chain = vi.fn(() => ({
      unsetLink,
      extendMarkRange,
      setLink,
    }));

    return {
      editor: { chain, state: { selection: { from, to } } } as any,
      mocks: {
        chain,
        unsetLink,
        extendMarkRange,
        setLink,
        setTextSelection,
        run,
      },
    };
  }

  it('unsets link when href is empty', () => {
    const { editor, mocks } = createMockEditor();
    setLinkHref(editor, '');
    expect(mocks.chain).toHaveBeenCalled();
    expect(mocks.unsetLink).toHaveBeenCalled();
    expect(mocks.run).toHaveBeenCalled();
  });

  it('does not call setLink when href is empty', () => {
    const { editor, mocks } = createMockEditor();
    setLinkHref(editor, '');
    expect(mocks.setLink).not.toHaveBeenCalled();
  });

  it('uses extendMarkRange for collapsed selection', () => {
    const { editor, mocks } = createMockEditor({ from: 5, to: 5 });
    setLinkHref(editor, 'https://example.com');
    expect(mocks.extendMarkRange).toHaveBeenCalledWith('link');
    expect(mocks.setLink).toHaveBeenCalledWith({ href: 'https://example.com' });
    expect(mocks.setTextSelection).toHaveBeenCalledWith({ from: 5, to: 5 });
    expect(mocks.run).toHaveBeenCalled();
  });

  it('uses setLink directly for range selection', () => {
    const { editor, mocks } = createMockEditor({ from: 2, to: 10 });
    setLinkHref(editor, 'https://example.com');
    expect(mocks.setLink).toHaveBeenCalledWith({ href: 'https://example.com' });
    expect(mocks.run).toHaveBeenCalled();
    expect(mocks.extendMarkRange).not.toHaveBeenCalled();
  });
});

describe('focusEditor', () => {
  it('calls editor.commands.focus() via setTimeout', () => {
    vi.useFakeTimers();
    const editor = { commands: { focus: vi.fn() } } as any;
    focusEditor(editor);
    expect(editor.commands.focus).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(editor.commands.focus).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
