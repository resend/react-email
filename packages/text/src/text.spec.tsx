import { render } from '@react-email/render';
import { Text } from './index';

describe('<Text> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Text>{testMessage}</Text>);
    expect(html).toMatchSnapshot();
  });

  it("gives priority to the user's style", async () => {
    const style = { margin: '12px', marginTop: '0px' };
    const html = await render(<Text style={style} />);
    expect(html).toMatchSnapshot();
  });

  it('passes style and other props correctly', async () => {
    const style = { fontSize: '16px' };
    const html = await render(<Text style={style}>Test</Text>);
    expect(html).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<Text>Lorem ipsum</Text>);
    expect(actualOutput).toMatchSnapshot();
  });
});
