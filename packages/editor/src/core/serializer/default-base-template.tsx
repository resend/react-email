import type * as React from 'react';
import { Body, Head, Html, Preview } from 'react-email';

type BaseTemplateProps = {
  children: React.ReactNode;
  previewText?: string;
};

export function DefaultBaseTemplate({
  children,
  previewText,
}: BaseTemplateProps) {
  return (
    <Html>
      <Head>
        <meta content="width=device-width" name="viewport" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta
          content="telephone=no,address=no,email=no,date=no,url=no"
          name="format-detection"
        />
      </Head>
      {previewText && previewText !== '' && <Preview>{previewText}</Preview>}

      <Body>{children}</Body>
    </Html>
  );
}
