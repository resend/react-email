import { Avatar } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Avatar> component', () => {
    const actualOutput = render(<Avatar src="cat.jpg" name=" My Cat" />);
    expect(actualOutput).toMatchSnapshot();
  });
});
