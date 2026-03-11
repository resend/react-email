import { describe, expect, it } from 'vitest';
import { defaultSlashCommands } from './commands';
import { filterAndRankItems, scoreItem } from './search';

describe('scoreItem', () => {
  const text = defaultSlashCommands.find((c) => c.title === 'Text')!;
  const title = defaultSlashCommands.find((c) => c.title === 'Title')!;
  const bulletList = defaultSlashCommands.find(
    (c) => c.title === 'Bullet List',
  )!;

  it('returns 100 for empty query', () => {
    expect(scoreItem(text, '')).toBe(100);
  });

  it('returns 100 for exact title match', () => {
    expect(scoreItem(text, 'Text')).toBe(100);
  });

  it('is case insensitive for exact match', () => {
    expect(scoreItem(text, 'text')).toBe(100);
  });

  it('returns 90 for title starts with', () => {
    expect(scoreItem(title, 'Tit')).toBe(90);
  });

  it('returns 80 for title word starts with', () => {
    expect(scoreItem(bulletList, 'Lis')).toBe(80);
  });

  it('returns 70 for exact search term match', () => {
    expect(scoreItem(text, 'paragraph')).toBe(70);
  });

  it('returns 60 for search term starts with', () => {
    expect(scoreItem(text, 'para')).toBe(60);
  });

  it('returns 40 for title contains', () => {
    expect(scoreItem(bulletList, 'llet')).toBe(40);
  });

  it('returns 30 for search term contains', () => {
    expect(
      scoreItem(
        { title: 'Foo', description: 'bar', searchTerms: ['abcdef'] },
        'cde',
      ),
    ).toBe(30);
  });

  it('returns 20 for description contains', () => {
    expect(
      scoreItem(
        { title: 'Foo', description: 'some long text', searchTerms: [] },
        'long',
      ),
    ).toBe(20);
  });

  it('returns 0 for no match', () => {
    expect(scoreItem(text, 'zzz')).toBe(0);
  });
});

describe('filterAndRankItems', () => {
  it('returns all items for empty query', () => {
    const result = filterAndRankItems(defaultSlashCommands, '');
    expect(result).toEqual(defaultSlashCommands);
  });

  it('returns all items for whitespace query', () => {
    const result = filterAndRankItems(defaultSlashCommands, '   ');
    expect(result).toEqual(defaultSlashCommands);
  });

  it('filters out non-matching items', () => {
    const result = filterAndRankItems(defaultSlashCommands, 'zzzzz');
    expect(result).toHaveLength(0);
  });

  it('is case insensitive', () => {
    const result = filterAndRankItems(defaultSlashCommands, 'TEXT');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title).toBe('Text');
  });

  it('ranks exact match above starts-with', () => {
    const result = filterAndRankItems(defaultSlashCommands, 'Text');
    expect(result[0].title).toBe('Text');
  });

  it('ranks title starts-with above search term match', () => {
    const result = filterAndRankItems(defaultSlashCommands, 'Tit');
    expect(result[0].title).toBe('Title');
  });

  it('finds items by search term', () => {
    const result = filterAndRankItems(defaultSlashCommands, 'h1');
    expect(result.some((item) => item.title === 'Title')).toBe(true);
  });

  it('returns items sorted by score descending', () => {
    const result = filterAndRankItems(defaultSlashCommands, 'col');
    const titles = result.map((i) => i.title);
    expect(titles).toContain('2 Columns');
    expect(titles).toContain('3 Columns');
    expect(titles).toContain('4 Columns');
  });
});
