import { categoryMarkdown, componentsIndexMarkdown } from './markdown';

const category = {
  name: 'Code Block',
  description: 'Syntax highlighted code.',
  components: [{ slug: 'code-block-basic', title: 'Basic code block' }],
};

describe('componentsIndexMarkdown', () => {
  it('lists each category with its markdown url', () => {
    const markdown = componentsIndexMarkdown([category]);

    expect(markdown).toContain('## Code Block');
    expect(markdown).toContain(
      'Markdown: https://react.email/components/code-block.md',
    );
    expect(markdown).toContain('- Basic code block');
  });
});

describe('categoryMarkdown', () => {
  it('emits one fenced block per available variant, in a fixed order', () => {
    const markdown = categoryMarkdown(category, [
      {
        slug: 'code-block-basic',
        title: 'Basic code block',
        code: {
          html: '<table></table>',
          'inline-styles': '<Section style={{}} />',
          tailwind: '<Section className="p-4" />',
        },
      },
    ]);

    expect(markdown.indexOf('### Tailwind')).toBeLessThan(
      markdown.indexOf('### Inline styles'),
    );
    expect(markdown).toContain('```tsx\n<Section className="p-4" />\n```');
    expect(markdown).not.toContain('<table>');
    expect(markdown).toContain(
      'Source: https://github.com/resend/react-email/tree/canary/apps/web/components/code-block-basic',
    );
  });
});
