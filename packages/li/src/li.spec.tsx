import { Ol } from '../../ol/src/index';
import { Ul } from '../../ul/src/index';
import { Li } from './index';

import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Li> component', () => {
    const actualOutput = render(<Li>Item</Li>);
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders the <Li> component inside a <Ol>', () => {
    const actualOutput = render(
      <Ol>
        <Li>Item 1</Li>
      </Ol>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders the <Li> component inside a <Ul>', () => {
    const actualOutput = render(
      <Ul>
        <Li>Item 1</Li>
      </Ul>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
