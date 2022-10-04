import { render } from '@react-email/render';
import { Avatar, AvatarFallback, AvatarImage } from './index';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Avatar> component', () => {
    const actualOutput = render(
      <Avatar>
        <AvatarImage src="cat.jpg" />
        <AvatarFallback>My Cat</AvatarFallback>
      </Avatar>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
