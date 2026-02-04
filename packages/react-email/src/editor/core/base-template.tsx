import { Body, Head, Html, Preview, Section } from '@react-email/components';
import type * as React from 'react';
import type { CssJs } from '../styles.js';

type BaseTemplateProps = {
  children: React.ReactNode;
  styles: CssJs;
  previewText: string | null;
  globalCss?: string;
};

export function BaseTemplate({
  children,
  styles,
  previewText,
  globalCss,
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

        {globalCss && <style>{globalCss}</style>}
      </Head>

      <Body>
        {previewText && previewText !== '' && <Preview>{previewText}</Preview>}
        <Section width="100%" align="center" style={styles.body}>
          <Section
            align={styles.container?.align}
            style={{
              ...styles.container,
              width: '100%',
              maxWidth: styles.container.width,
              fontFamily: styles.body.fontFamily,
            }}
          >
            {children}
          </Section>
        </Section>
      </Body>
    </Html>
  );
}
