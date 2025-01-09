import { render } from '../render/node';
import { Head } from '.';

describe('<Head> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Head>{testMessage}</Head>);
    expect(html).toContain(testMessage);
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<Head />);
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders style tags', async () => {
    const actualOutput = await render(
      <Head>
        <style>
          {`body{
            color: red;
          }`}
        </style>
      </Head>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
