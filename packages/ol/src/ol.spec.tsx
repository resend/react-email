import { Ol } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Ol> component', () => {
    const actualOutput = render(
      <Ol>
        <li>foo</li>
        <li>bar</li>
      </Ol>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
