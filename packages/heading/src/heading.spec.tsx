import { Heading } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Heading> component', () => {
    const actualOutput = render(<Heading as="h2">Lorem ipsum</Heading>);
    expect(actualOutput).toMatchSnapshot();
  });
});
