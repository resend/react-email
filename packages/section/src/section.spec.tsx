import { Section } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Section> component', () => {
    const actualOutput = render(<Section>Lorem ipsum</Section>);
    expect(actualOutput).toMatchSnapshot();
  });
});
