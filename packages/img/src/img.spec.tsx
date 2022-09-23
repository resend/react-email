import { Img } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Img> component', () => {
    const actualOutput = render(
      <Img src="cat.jpg" alt="Cat" width="300" height="300" />,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
