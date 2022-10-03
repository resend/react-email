import { Preview } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Preview> component', () => {
    const actualOutput = render(<Preview>Email preview text</Preview>);
    expect(actualOutput).toMatchSnapshot();
  });
});
