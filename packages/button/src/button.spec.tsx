import { Button } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Button> component', () => {
    const actualOutput = render(<Button href="https://example.com" />);
    expect(actualOutput).toMatchSnapshot();
  });
});
