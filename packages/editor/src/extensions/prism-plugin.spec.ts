import Prism from 'prismjs';
import { LOCAL_PROPS_SCHEMA } from '../ui/inspector/config/attribute-schema';
import { languageLoaders } from './prism-plugin';

describe('languageLoaders', () => {
  it('covers every language the inspector offers that Prism core does not ship', () => {
    const pickerLanguages = Object.keys(
      LOCAL_PROPS_SCHEMA.language.options ?? {},
    );
    expect(pickerLanguages.length).toBeGreaterThan(0);

    const uncovered = pickerLanguages.filter(
      (language) =>
        typeof Prism.languages[language] !== 'object' &&
        !(language in languageLoaders),
    );

    expect(uncovered).toEqual([]);
  });

  it('registers the grammar it loads for each language', async () => {
    for (const [language, load] of Object.entries(languageLoaders)) {
      await load();
      expect(typeof Prism.languages[language]).toBe('object');
    }
  });
});
