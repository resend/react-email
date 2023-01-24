import { Ul } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Ul> component', () => {
    const actualOutput = render(
      <Ul>
        <li>Item 1</li>
      </Ul>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders children components', () => {
    const actualOutput = render(
      <Ul>
        <li>Item 1</li>
      </Ul>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
