import type { SelectorDefinition } from 'html-to-text';

export const plainTextSelectors: SelectorDefinition[] = [
  { selector: 'img', format: 'skip' },
  { selector: '#__react-email-preview', format: 'skip' },
  {
    selector: 'a',
    options: { linkBrackets: false },
  },
];
