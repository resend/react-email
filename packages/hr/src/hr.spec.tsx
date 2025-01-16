import { render } from '@react-email/render';
import { Hr } from './index';

describe('<Hr> component', () => {
  it('passes styles and other props correctly', async () => {
    const style = {
      width: '50%',
      borderColor: 'black',
    };
    const html = await render(<Hr data-testid="hr-test" style={style} />);
    expect(html).toContain('width:50%');
    expect(html).toContain('border-color:black');
    expect(html).toContain('data-testid="hr-test"');
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<Hr />);
    expect(actualOutput).toMatchSnapshot();
  });
});
