import { Body, Head, Html, Preview, Section } from '@react-email/components';
import type * as React from 'react';

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

      <Body>
        <Section width="100%" align="center">
          <Section
            style={{
              width: '100%',
            }}
          >
            {children}
          </Section>
        </Section>
      </Body>
    </Html>
  );
}
