import { render } from '@react-email/render';
import { Stack } from './index';

describe('<Stack> component', () => {
  it('renders children correctly', async () => {
    const html = await render(
      <Stack>
        <span>First</span>
        <span>Second</span>
      </Stack>,
    );
    expect(html).toContain('First');
    expect(html).toContain('Second');
  });

  it('passes style and other props correctly', async () => {
    const html = await render(
      <Stack data-testid="stack" style={{ backgroundColor: 'red' }}>
        <span>Only one</span>
      </Stack>,
    );
    expect(html).toContain('data-testid="stack"');
    expect(html).toContain('background-color:red');
  });

  it('applies gap as paddingBottom on cells (Outlook-safe)', async () => {
    const html = await render(
      <Stack gap={16}>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(html).toContain('padding-bottom:16px');
  });

  it('accepts gap as string', async () => {
    const html = await render(
      <Stack gap="1em">
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(html).toContain('padding-bottom:1em');
  });

  it('renders correctly', async () => {
    const actual = await render(
      <Stack gap={8}>
        <span>One</span>
        <span>Two</span>
      </Stack>,
    );
    expect(actual).toContain('<table');
    expect(actual).toContain('<tbody');
    expect(actual).toContain('<tr');
    expect(actual).toContain('data-id="__react-email-column"');
    expect(actual).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody style="width:100%"><tr style="width:100%"><td data-id="__react-email-column" style="vertical-align:top;padding-bottom:8px"><span>One</span></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody style="width:100%"><tr style="width:100%"><td data-id="__react-email-column" style="vertical-align:top"><span>Two</span></td></tr></tbody></table><!--/$-->"`,
    );
  });
});
