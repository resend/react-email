import Prism from 'prismjs';
import { describe, expect, it } from 'vitest';
import { loadPrismLanguage } from './prism-plugin';

const highlightedTokens = (code: string, language: string) =>
  Prism.highlight(code, Prism.languages[language], language).match(
    /class="token/g,
  )?.length ?? 0;

describe('loadPrismLanguage', () => {
  it('loads the grammar that defines an alias', async () => {
    await loadPrismLanguage('shell');

    expect(highlightedTokens('curl -X POST "$URL" # send', 'shell')).toBe(5);
  });

  it('loads the grammars a language requires before the language', async () => {
    await loadPrismLanguage('php');

    expect(highlightedTokens('<?php $x = 1; echo $x;', 'php')).toBeGreaterThan(
      0,
    );
    // prism-php loaded without markup-templating leaves a hook behind that
    // throws on every later highlight, whatever the language.
    expect(highlightedTokens('const x = 1;', 'javascript')).toBeGreaterThan(0);
  });

  it('loads every requirement of a language with several', async () => {
    await loadPrismLanguage('tsx');

    expect(
      highlightedTokens('const a = <Box size={2} />;', 'tsx'),
    ).toBeGreaterThan(0);
  });

  it('rejects a language Prism does not have', async () => {
    await expect(loadPrismLanguage('not-a-language')).rejects.toThrow(
      'not-a-language',
    );
  });
});
