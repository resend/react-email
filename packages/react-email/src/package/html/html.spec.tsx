import { render } from '../render/node';
import { Html } from '.';

describe('<Html> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Html>{testMessage}</Html>);
    expect(html).toContain(testMessage);
  });

  it('passes props correctly', async () => {
    const html = await render(
      <Html data-testid="html-test" dir="rtl" lang="fr" />,
    );
    expect(html).toContain('lang="fr"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('data-testid="html-test"');
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<Html />);
    expect(actualOutput).toMatchSnapshot();
  });
});
