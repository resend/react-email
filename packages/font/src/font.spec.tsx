import { Font } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Font> component', () => {
    const actualOutput = render(
      <Font fontFamily="Roboto" fallbackFontFamily={'Verdana'} />,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
