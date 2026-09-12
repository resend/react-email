import { forceColorScheme } from './force-color-scheme';

const styled = (css: string) => {
  document.head.innerHTML = `<style>${css}</style>`;
  return document;
};

const conditions = () => {
  const rules = (document.styleSheets[0] as CSSStyleSheet).cssRules;
  const collected: string[] = [];
  const walk = (list: CSSRuleList) => {
    for (let index = 0; index < list.length; index++) {
      const rule = list[index] as CSSMediaRule & CSSGroupingRule;
      if (typeof rule.media?.mediaText === 'string') {
        collected.push(rule.media.mediaText);
      }
      if (rule.cssRules) walk(rule.cssRules);
    }
  };
  walk(rules);
  return collected;
};

describe('forceColorScheme()', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('leaves the CSS untouched when the browser already reports what we want', () => {
    // Nothing to correct, and the browser's own evaluation of the email's
    // queries beats any rewrite for fidelity.
    const css = '@media (prefers-color-scheme: dark){.card{background:#111}}';
    forceColorScheme(styled(css), { from: 'dark', to: 'dark' });

    expect(conditions()).toEqual(['(prefers-color-scheme: dark)']);
  });

  it('flips a dark query so it matches a browser reporting light', () => {
    forceColorScheme(
      styled('@media (prefers-color-scheme: dark){.card{background:#111}}'),
      { from: 'light', to: 'dark' },
    );

    expect(conditions()).toEqual(['(prefers-color-scheme: light)']);
  });

  it('stops a dark query from matching a browser reporting dark', () => {
    // The case the preview gets wrong without this: a reader whose OS is in
    // dark mode asking for the light preview, or for the inversion emulation,
    // and getting the email's dark theme anyway.
    forceColorScheme(
      styled('@media (prefers-color-scheme: dark){.card{background:#111}}'),
      { from: 'dark', to: 'light' },
    );

    expect(conditions()).toEqual(['(prefers-color-scheme: light)']);
  });

  it('flips light queries too, not just dark ones', () => {
    // An email that themes both ways would otherwise keep its light rules
    // matched while the dark ones were forced on top of them.
    forceColorScheme(
      styled(
        '@media (prefers-color-scheme: light){.card{background:#fff}}' +
          '@media (prefers-color-scheme: dark){.card{background:#111}}',
      ),
      { from: 'light', to: 'dark' },
    );

    expect(conditions()).toEqual([
      '(prefers-color-scheme: dark)',
      '(prefers-color-scheme: light)',
    ]);
  });

  it('keeps the other conditions of a compound query', () => {
    // Dropping `screen` would leak the dark styles into print.
    forceColorScheme(
      styled(
        '@media screen and (prefers-color-scheme: dark){.card{color:#fff}}',
      ),
      { from: 'light', to: 'dark' },
    );

    expect(conditions()).toEqual(['screen and (prefers-color-scheme: light)']);
  });

  it('rewrites every query in a comma separated list', () => {
    forceColorScheme(
      styled(
        '@media print, screen and (prefers-color-scheme: dark){.c{color:#fff}}',
      ),
      { from: 'light', to: 'dark' },
    );

    expect(conditions()).toEqual([
      'print, screen and (prefers-color-scheme: light)',
    ]);
  });

  it('rewrites a negated condition, leaving the browser to evaluate the `not`', () => {
    forceColorScheme(
      styled('@media not (prefers-color-scheme: dark){.c{color:#000}}'),
      { from: 'light', to: 'dark' },
    );

    expect(conditions()).toEqual(['not (prefers-color-scheme: light)']);
  });

  it('reads a condition written without spaces', () => {
    // What the `<Tailwind>` component emits, and what happy-dom preserves
    // verbatim — so matching on `prefers-color-scheme: dark` with a literal
    // space would miss it.
    forceColorScheme(
      styled('@media (prefers-color-scheme:dark){.c{color:#fff}}'),
      { from: 'light', to: 'dark' },
    );

    expect(conditions()).toEqual(['(prefers-color-scheme:light)']);
  });

  it('finds a query nested inside another grouping rule', () => {
    forceColorScheme(
      styled(
        '@supports (color: color-mix(in srgb, red, blue)){' +
          '@media (prefers-color-scheme: dark){.card{background:#111}}}',
      ),
      { from: 'light', to: 'dark' },
    );

    expect(conditions()).toEqual(['(prefers-color-scheme: light)']);
  });

  it('leaves queries that say nothing about the color scheme alone', () => {
    forceColorScheme(
      styled('@media print{.c{color:#000}}@media (max-width:600px){.c{}}'),
      { from: 'light', to: 'dark' },
    );

    expect(conditions()).toEqual(['print', '(max-width:600px)']);
  });

  it("restores the email's own condition when the forcing is lifted", () => {
    const document = styled(
      '@media screen and (prefers-color-scheme: dark){.c{color:#fff}}',
    );

    forceColorScheme(document, { from: 'light', to: 'dark' });
    forceColorScheme(document, { from: 'light', to: 'light' });

    expect(conditions()).toEqual(['screen and (prefers-color-scheme: dark)']);
  });

  it('stays put when applied repeatedly', () => {
    // The preview re-syncs on every render, so forcing has to be idempotent —
    // a flip derived from the previous flip would toggle back and forth. Each
    // application is checked, since only looking at the end of an odd number of
    // them would read a flip-flop as a fixed point.
    const document = styled(
      '@media (prefers-color-scheme: dark){.c{color:#fff}}',
    );

    for (let application = 0; application < 4; application++) {
      forceColorScheme(document, { from: 'light', to: 'dark' });
      expect(conditions()).toEqual(['(prefers-color-scheme: light)']);
    }
  });

  it('never rewrites the <style> element the markup came from', () => {
    // Only the live CSSOM is forced, so the source view and anything copied
    // out of the preview stay the email as authored.
    const css = '@media (prefers-color-scheme: dark){.c{color:#fff}}';
    forceColorScheme(styled(css), { from: 'light', to: 'dark' });

    expect(document.head.querySelector('style')!.textContent).toBe(css);
  });

  it('skips a stylesheet whose rules cannot be read', () => {
    // A cross-origin `<link>` throws on `cssRules`; the sheets after it still
    // have to be forced.
    const media = { mediaText: '(prefers-color-scheme: dark)' };
    const documentWithUnreadableSheet = {
      styleSheets: [
        {
          get cssRules(): CSSRuleList {
            throw new Error('SecurityError');
          },
        },
        { cssRules: { length: 1, 0: { media } } },
      ],
    } as unknown as Document;

    forceColorScheme(documentWithUnreadableSheet, {
      from: 'light',
      to: 'dark',
    });

    expect(media.mediaText).toBe('(prefers-color-scheme: light)');
  });

  it('forces every stylesheet in the document', () => {
    forceColorScheme(
      styled('@media (prefers-color-scheme: dark){.first{color:#111}}'),
      { from: 'light', to: 'dark' },
    );
    document.head.insertAdjacentHTML(
      'beforeend',
      '<style>@media (prefers-color-scheme: dark){.second{color:#222}}</style>',
    );
    forceColorScheme(document, { from: 'light', to: 'dark' });

    expect(conditions()).toEqual(['(prefers-color-scheme: light)']);
    const second = (document.styleSheets[1] as CSSStyleSheet)
      .cssRules[0] as CSSMediaRule;
    expect(second.media.mediaText).toBe('(prefers-color-scheme: light)');
  });
});
