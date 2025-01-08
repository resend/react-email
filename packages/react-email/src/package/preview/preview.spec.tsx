/* eslint-disable no-irregular-whitespace */
import { render } from '../render/node';
import { Preview, renderWhiteSpace } from '.';

describe('<Preview> component', () => {
  it('renders correctly', async () => {
    const actualOutput = await render(<Preview>Email preview text</Preview>);
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders correctly with array text', async () => {
    const actualOutputArray = await render(
      <Preview>Email preview text</Preview>,
    );
    expect(actualOutputArray).toMatchSnapshot();
  });

  it('renders correctly with really long text', async () => {
    const longText = 'really long'.repeat(100);
    const actualOutputLong = await render(<Preview>{longText}</Preview>);
    expect(actualOutputLong).toMatchSnapshot();
  });
});

describe('renderWhiteSpace', () => {
  it('renders null when text length is greater than or equal to PREVIEW_MAX_LENGTH (150)', () => {
    const text =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore mollitia dignissimos itaque. At excepturi reiciendis iure molestias incidunt. Ab saepe, nostrum dicta dolor maiores tenetur eveniet odio amet ipsum?';
    const html = renderWhiteSpace(text);
    expect(html).toBeNull();
  });

  it('renders white space characters when text length is less than PREVIEW_MAX_LENGTH', () => {
    const text = 'Short text';
    const whiteSpaceCharacters = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF';

    const html = renderWhiteSpace(text);
    expect(html).not.toBeNull();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const actualTextContent = html?.props.children;
    const expectedTextContent = whiteSpaceCharacters.repeat(150 - text.length);
    expect(actualTextContent).toBe(expectedTextContent);
  });
});
