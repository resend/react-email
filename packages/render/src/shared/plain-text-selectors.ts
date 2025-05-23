import type { SelectorDefinition } from 'html-to-text';

export const plainTextSelectors: SelectorDefinition[] = [
  { selector: 'img', format: 'skip' },
  { selector: '[data-skip-in-text=true]', format: 'skip' },
  {
    selector: 'a',
    options: { linkBrackets: false },
  },
];
