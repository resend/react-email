import { render } from '../render/node';
import { Markdown } from '.';

describe('<Markdown> component renders correctly', () => {
  it('renders the markdown in the correct format for browsers', async () => {
    const actualOutput = await render(
      <Markdown>
        {`# Markdown Test Document

This is a **test document** to check the capabilities of a Markdown parser.

## Headings

### Third-Level Heading

#### Fourth-Level Heading

##### Fifth-Level Heading

###### Sixth-Level Heading

## Text Formatting

This is some **bold text** and this is some *italic text*. You can also use ~~strikethrough~~ and \`inline code\`.

## Lists

1. Ordered List Item 1
2. Ordered List Item 2
3. Ordered List Item 3

- Unordered List Item 1
- Unordered List Item 2
- Unordered List Item 3

## Links

[Markdown Guide](https://www.markdownguide.org)

## Images

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Blockquotes

> This is a blockquote.
> - Author

## Code Blocks

\`\`\`javascript
function greet(name) {
console.log(\`Hello, $\{name}!\`);
}
\`\`\``}
      </Markdown>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders the headers in the correct format for browsers', async () => {
    const actualOutput = await render(
      <Markdown>
        {`
# Heading 1!
## Heading 2!
### Heading 3!
#### Heading 4!
##### Heading 5!
###### Heading 6!
       `}
      </Markdown>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders text in the correct format for browsers', async () => {
    const actualOutput = await render(
      <Markdown
        markdownCustomStyles={{
          bold: {
            font: '700 23px / 32px "Roobert PRO", system-ui, sans-serif',
            background: 'url("path/to/image")',
          },
        }}
      >
        **This is sample bold text in markdown** and *this is italic text*
      </Markdown>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders links in the correct format for browsers', async () => {
    const actualOutput = await render(
      <Markdown>Link to [React-email](https://react.email)</Markdown>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders lists in the correct format for browsers', async () => {
    const actualOutput = await render(
      <Markdown>
        {`
# Below is a list 

- Item One
- Item Two
- Item Three
       `}
      </Markdown>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
