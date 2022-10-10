import { Pre } from './index';
import { render } from '@react-email/render';

const preformattedText = `body {
  color: red;
}`;

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Pre> component', () => {
    const actualOutput = render(<Pre>{preformattedText}</Pre>);

    expect(actualOutput).toMatchSnapshot();
  });
});
