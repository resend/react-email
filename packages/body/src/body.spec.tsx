import { Body } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Body> component', () => {
    const actualOutput = render(<Body>Lorem ipsum</Body>);
    expect(actualOutput).toMatchSnapshot();
  });
});
