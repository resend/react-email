import { render } from '@react-email/render';
import { Avatar, AvatarFallback, AvatarImage } from './index';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Avatar> component with a <AvatarImage> component', () => {
    const actualOutput = render(
      <Avatar>
        <AvatarImage src="https://github.com/zenorocha.png" />
        <AvatarFallback>Zeno Rocha</AvatarFallback>
      </Avatar>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders the <Avatar> component with a <AvatarFallback> component', () => {
    const actualOutput = render(
      <Avatar>
        <AvatarFallback>Zeno Rocha</AvatarFallback>
      </Avatar>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
