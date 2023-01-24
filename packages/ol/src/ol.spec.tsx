import { Ol } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Ol> component', () => {
    const actualOutput = render(<Ol />);
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders children components', () => {
    const actualOutput = render(
      <Ol>
        <li>Item 1</li>
      </Ol>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
