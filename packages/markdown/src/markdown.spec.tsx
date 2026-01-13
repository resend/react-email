import { render } from '@react-email/render';
import { Markdown } from './markdown';

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
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div data-id="react-email-markdown"><h1 style="font-weight:500;padding-top:20px;font-size:2.5rem">Markdown Test Document</h1><p>This is a <strong style="font-weight:bold">test document</strong> to check the capabilities of a Markdown parser.</p>
      <h2 style="font-weight:500;padding-top:20px;font-size:2rem">Headings</h2><h3 style="font-weight:500;padding-top:20px;font-size:1.75rem">Third-Level Heading</h3><h4 style="font-weight:500;padding-top:20px;font-size:1.5rem">Fourth-Level Heading</h4><h5 style="font-weight:500;padding-top:20px;font-size:1.25rem">Fifth-Level Heading</h5><h6 style="font-weight:500;padding-top:20px;font-size:1rem">Sixth-Level Heading</h6><h2 style="font-weight:500;padding-top:20px;font-size:2rem">Text Formatting</h2><p>This is some <strong style="font-weight:bold">bold text</strong> and this is some <em style="font-style:italic">italic text</em>. You can also use <del>strikethrough</del> and <code style="color:#212529;font-size:87.5%;display:inline;background: #f8f8f8;font-family:SFMono-Regular,Menlo,Monaco,Consolas,monospace;word-wrap:break-word">inline code</code>.</p>
      <h2 style="font-weight:500;padding-top:20px;font-size:2rem">Lists</h2><ol>
      <li>Ordered List Item 1</li>
      <li>Ordered List Item 2</li>
      <li>Ordered List Item 3</li>
      </ol>
      <ul>
      <li>Unordered List Item 1</li>
      <li>Unordered List Item 2</li>
      <li>Unordered List Item 3</li>
      </ul>
      <h2 style="font-weight:500;padding-top:20px;font-size:2rem">Links</h2><p><a href="https://www.markdownguide.org" target="_blank" style="color:#007bff;text-decoration:underline;background-color:transparent">Markdown Guide</a></p>
      <h2 style="font-weight:500;padding-top:20px;font-size:2rem">Images</h2><p><img src="https://markdown-here.com/img/icon256.png" alt="Markdown Logo"></p>
      <h2 style="font-weight:500;padding-top:20px;font-size:2rem">Blockquotes</h2><blockquote style="background:#f9f9f9;border-left:10px solid #ccc;margin:1.5em 10px;padding:1em 10px">
      <p>This is a blockquote.</p>
      <ul>
      <li>Author</li>
      </ul>
      </blockquote>
      <h2 style="font-weight:500;padding-top:20px;font-size:2rem">Code Blocks</h2><pre style="color:#212529;font-size:87.5%;display:block;background: #f8f8f8;font-family:SFMono-Regular,Menlo,Monaco,Consolas,monospace;padding-top:10px;padding-right:10px;padding-left:10px;padding-bottom:1px;margin-bottom:20px;word-wrap:break-word"><code>function greet(name) {
      console.log(\`Hello, \${name}!\`);
      }
      </code></pre>
      </div><!--/$-->"
    `);
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
    expect(actualOutput).toMatchInlineSnapshot(`"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div data-id="react-email-markdown"><h1 style="font-weight:500;padding-top:20px;font-size:2.5rem">Heading 1!</h1><h2 style="font-weight:500;padding-top:20px;font-size:2rem">Heading 2!</h2><h3 style="font-weight:500;padding-top:20px;font-size:1.75rem">Heading 3!</h3><h4 style="font-weight:500;padding-top:20px;font-size:1.5rem">Heading 4!</h4><h5 style="font-weight:500;padding-top:20px;font-size:1.25rem">Heading 5!</h5><h6 style="font-weight:500;padding-top:20px;font-size:1rem">Heading 6!</h6></div><!--/$-->"`);
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
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div data-id="react-email-markdown"><p><strong style="font:700 23px / 32px &#x27;Roobert PRO&#x27;, system-ui, sans-serif;background:url(&#x27;path/to/image&#x27;)">This is sample bold text in markdown</strong> and <em style="font-style:italic">this is italic text</em></p>
      </div><!--/$-->"
    `);
  });

  it('renders links in the correct format for browsers', async () => {
    const actualOutput = await render(
      <Markdown>Link to [React-email](https://react.email)</Markdown>,
    );
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div data-id="react-email-markdown"><p>Link to <a href="https://react.email" target="_blank" style="color:#007bff;text-decoration:underline;background-color:transparent">React-email</a></p>
      </div><!--/$-->"
    `);
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
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div data-id="react-email-markdown"><h1 style="font-weight:500;padding-top:20px;font-size:2.5rem">Below is a list</h1><ul>
      <li>Item One</li>
      <li>Item Two</li>
      <li>Item Three</li>
      </ul>
      </div><!--/$-->"
    `);
  });

  it('renders nested lists in the correct format for browsers', async () => {
    const actualOutput = await render(
      <Markdown>
        {`
- parent list item
    - nested list item 1
    - nested list item 2
- another parent item
    1. nested ordered item 1
    2. nested ordered item 2
       `}
      </Markdown>,
    );
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div data-id="react-email-markdown"><ul>
      <li><p>parent list item</p>
      <ul>
      <li>nested list item 1</li>
      <li>nested list item 2</li>
      </ul>
      </li>
      <li><p>another parent item</p>
      <ol>
      <li>nested ordered item 1</li>
      <li>nested ordered item 2</li>
      </ol>
      </li>
      </ul>
      </div><!--/$-->"
    `);
  });
});
