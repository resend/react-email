import { render } from '@react-email/render';
import { Columns } from './index';

describe('<Columns> component', () => {
  it('renders children correctly', async () => {
    const html = await render(
      <Columns>
        <span>Left</span>
        <span>Right</span>
      </Columns>,
    );
    expect(html).toContain('Left');
    expect(html).toContain('Right');
  });

  it('passes style and other props correctly', async () => {
    const html = await render(
      <Columns data-testid="cols" style={{ backgroundColor: 'red' }}>
        <span>One</span>
      </Columns>,
    );
    expect(html).toContain('data-testid="cols"');
    expect(html).toContain('background-color:red');
  });

  it('applies equal widths when columnWidths not provided', async () => {
    const html = await render(
      <Columns cols={2}>
        <span>A</span>
        <span>B</span>
      </Columns>,
    );
    expect(html).toContain('width:50%');
  });

  it('applies custom columnWidths', async () => {
    const html = await render(
      <Columns columnWidths={['60%', '40%']}>
        <span>Main</span>
        <span>Side</span>
      </Columns>,
    );
    expect(html).toContain('width:60%');
    expect(html).toContain('width:40%');
  });

  it('applies gap as padding between columns', async () => {
    const html = await render(
      <Columns gap={16}>
        <span>A</span>
        <span>B</span>
      </Columns>,
    );
    expect(html).toContain('padding-left:8px');
    expect(html).toContain('padding-right:8px');
  });

  it('renders correctly', async () => {
    const actualOutput = await render(
      <Columns cols={2}>
        <span>One</span>
        <span>Two</span>
      </Columns>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody style="width:100%"><tr style="width:100%"><td data-id="__react-email-column" style="width:50%;vertical-align:top;padding-right:0px"><span>One</span></td><td data-id="__react-email-column" style="width:50%;vertical-align:top;padding-left:0px"><span>Two</span></td></tr></tbody></table><!--/$-->"`,
    );
  });
});
