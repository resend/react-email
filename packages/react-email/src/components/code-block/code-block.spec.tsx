import { render } from '@react-email/render';
import { CodeBlock } from './index.js';
import { dracula } from './themes.js';

describe('<CodeBlock> component', () => {
  it('renders spaces as plain spaces so copied code still runs', async () => {
    const code = 'npm install resend\nif (ok) {\n  send();\n}';
    const html = await render(
      <CodeBlock code={code} language="javascript" theme={dracula} />,
    );

    expect(html).not.toMatch(/[\u00A0\u200B\u200D]/);

    const pre = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('pre');
    for (const br of pre?.querySelectorAll('br') ?? []) {
      br.replaceWith('\n');
    }
    expect(pre?.textContent).toBe(`${code}\n`);
  });
});
