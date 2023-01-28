import { Html } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Html> component', () => {
    const actualOutput = render(<Html />);
    expect(actualOutput).toMatchSnapshot();
  });
});
