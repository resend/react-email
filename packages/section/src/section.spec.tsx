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

  it('renders the <Section> with <td> wrapper if no <Column> is provided', () => {
    const actualOutput = render(
      <Section>
        <div>Lorem ipsum</div>
      </Section>
    );
    expect(actualOutput).toContain("<td>");
  });

  it('renders the <Section> with <td> wrapper if <Column> is provided', () => {
    const actualOutput = render(
      <Section>
        <td>Lorem ipsum</td>
      </Section>
    );
    expect(actualOutput).toContain("<td>");
  });

  it('renders the <Section> wrapping any child provided in a <td> tag', () => {
    const actualOutput = render(
      <Section>
        <div>Lorem ipsum</div>
        <p>Lorem ipsum</p>
        <img src="lorem.ipsum" alt="Lorem" />
      </Section>
    );
    const tdChildrenArr = actualOutput.match(/<td\s*.*?>.*?<\/td>/g);
    expect(tdChildrenArr).toHaveLength(3);
  });
});
