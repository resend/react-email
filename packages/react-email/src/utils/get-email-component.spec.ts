import path from 'node:path';
import fs from 'node:fs/promises';
import {
  addSourceHintsToJSX,
  getEmailComponent,
} from './get-email-component';

describe('addSourceHintsToJSX()', () => {
  it('should work with a single div in a component', () => {
    expect(
      addSourceHintsToJSX(
        `export default function MyEmail() {
  return <div className="testing classes to make sure this is not removed" id="my-div" aria-label="my beautiful div">
    inside the div, should also stay unchanged
  </div>;
}`,
        '/my/project/email.tsx',
      ),
    ).toBe(`export default function MyEmail() {
  return <div className="testing classes to make sure this is not removed" id="my-div" aria-label="my beautiful div" data-preview-file="/my/project/email.tsx" data-preview-line="2" data-preview-column="10">
    inside the div, should also stay unchanged
  </div>;
}`);
  });

  it('should work with void elements', () => {
    expect(
      addSourceHintsToJSX(
        `




<div/>



                     <span/>`,
        '/my/project/email.tsx',
      ),
    ).toBe(`




<div data-preview-file="/my/project/email.tsx" data-preview-line="6" data-preview-column="1"/>



                     <span data-preview-file="/my/project/email.tsx" data-preview-line="10" data-preview-column="22"/>`);
  });

  it('should work with real email template', async () => {
    const emailPath = path.resolve(
      __dirname,
      '../../../../apps/demo/emails/notifications/vercel-invite-user.tsx',
    );
    expect(
      addSourceHintsToJSX(await fs.readFile(emailPath, 'utf8'), emailPath),
    ).toMatchSnapshot();
  });
});

describe('getEmailComponent()', () => {
  describe('Node internals support', () => {
    test('Request', async () => {
      const result = await getEmailComponent(
        path.resolve(__dirname, './testing/request-response-email.tsx'),
      );
      if ('error' in result) {
        console.log(result.error);
        expect('error' in result, 'there should be no errors').toBe(false);
      }
    });
  });

  test('with a demo email template', async () => {
    const result = await getEmailComponent(
      path.resolve(
        __dirname,
        '../../../../apps/demo/emails/notifications/vercel-invite-user.tsx',
      ),
    );

    if ('error' in result) {
      console.log(result.error);
      expect('error' in result).toBe(false);
    } else {
      expect(result.emailComponent).toBeTruthy();
      expect(result.sourceMapToOriginalFile).toBeTruthy();

      const emailHtml = await result.render(
        result.createElement(
          result.emailComponent,
          result.emailComponent.PreviewProps,
        ),
      );
      expect(emailHtml).toMatchSnapshot();
    }
  });
});
