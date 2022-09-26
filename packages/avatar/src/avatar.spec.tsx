import { Avatar } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the simple <Avatar> component', () => {
    const actualOutput = render(<Avatar from="cat.jpg" fromAlt="Cat" />);
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders the invited to <Avatar> with invitation component', () => {
    const actualOutput = render(
      <Avatar from="cat.jpg" fromAlt="Cat" to="cat.jpg" toAlt="Cat" />,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
