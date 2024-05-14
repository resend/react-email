import path from 'node:path';
import * as React from 'react';
import { getEmailComponent } from './get-email-component';

test('getEmailComponent() with a demo email template', async () => {
  const result = await getEmailComponent(
    path.resolve(__dirname, './testing/email-template.tsx'),
  );

  if ('error' in result) {
    console.log(result.error);
    expect('error' in result).toBe(false);
  } else {
    expect(result.emailComponent).toBeTruthy();
    expect(result.sourceMapToOriginalFile).toBeTruthy();

    const emailHtml = await result.renderAsync(
      React.createElement(
        result.emailComponent,
        result.emailComponent.PreviewProps,
      ),
    );
    expect(emailHtml).toMatchSnapshot();
  }
});
