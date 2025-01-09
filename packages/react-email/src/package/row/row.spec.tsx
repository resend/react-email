/* eslint-disable react/no-children-prop */
import { render } from '../render/node';
import { Row } from '.';

describe('<Row> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Row>{testMessage}</Row>);
    expect(html).toContain(testMessage);
  });

  it('passes style and other props correctly', async () => {
    const style = { backgroundColor: 'red' };
    const html = await render(
      <Row data-testid="row-test" style={style}>
        Test
      </Row>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="row-test"');
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<Row children={undefined} />);
    expect(actualOutput).toMatchSnapshot();
  });
});
