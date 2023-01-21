import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Hr } from '@react-email/hr';
import { Column } from '@react-email/column';
import { Link } from '@react-email/link';
import * as React from 'react';

export default function Email() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';
  const url = 'https://codepen.io';
  return (
    <Html>
      <Head />
      <Preview>Codepen - A few things to know about CodePen.</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={header}>
            <Column>
              <Img
                width={50}
                src={`${baseUrl}/static/codepen-logo.png`}
                style={{ opacity: 0.5, alignSelf: 'flex-start' }}
              />
              <Section style={headerContent}>
                <Text style={headerContentTitle}>
                  Thanks again for signing up for CodePen.
                </Text>
                <Text style={headerContentSubtitle}>
                  Here's a few interesting things you might not know.
                </Text>
              </Section>
            </Column>
          </Section>

          <Section style={content}>
            <Text style={title}>
              You can customize the heck out of the editor.
            </Text>
            <Text style={paragraph}>
              Go to{' '}
              <Link href={url} style={link}>
                this page
              </Link>{' '}
              of your User Settings and go nuts. You can do things like change
              the syntax highlighting colors, turn on and off code folding, and
              set default preprocessing languages.
            </Text>

            <Text style={title}>Searching CodePen can be pretty useful.</Text>
            <Text style={paragraph}>
              There are millions and millions of Pens on CodePen and you can
              search through all of them. Needs to find an accessible version of
              tabs? You can.{' '}
              <Link href={url} style={link}>
                You can
              </Link>{' '}
              also search only your own Pens, or only people you follow, as an
              example of some of the Advanced Options. Whatever you find on
              CodePen, you can use, thanks to the{' '}
              <Link href={url} style={link}>
                open licensing
              </Link>{' '}
              of public Pens.
            </Text>

            <Text style={title}>People write on CodePen.</Text>
            <Text style={paragraph}>
              CodePen isn't just a code editor, it's a text editor too! Anybody
              can{' '}
              <Link href={url} style={link}>
                write posts
              </Link>
              , the best of which are{' '}
              <Link href={url} style={link}>
                featured
              </Link>
              .
            </Text>

            <Hr style={footerDivider} />

            <Text style={paragraph}>
              If you have any questions about CodePen, don't hesistate to{' '}
              <Link href={url} style={link}>
                ask{' '}
              </Link>
              .
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          You're receiving this email because you are a member of CodePen. You
          can{' '}
          <Link href={url} style={link}>
            instantly opt out
          </Link>{' '}
          any time.
        </Section>
      </Section>
    </Html>
  );
}

const fontFamily = 'Lucida Grande,Lucida Sans Unicode,Verdana,sans-serif';

const link = {
  color: '#2f82de',
  fontWeight: 'bold',
  textDecoration: 'none',
};

const main = {
  backgroundColor: '#c7c7c7',
  fontFamily,
  paddingBottom: '30px',
};

const container = {
  maxWidth: '600px',
  width: '100%',
  margin: '30px auto 0 auto',
  backgroundColor: '#ffffff',
};

const content = {
  padding: '30px 30px 30px 100px',
};

const headerContent = { marginLeft: '22px' };

const headerContentTitle = {
  color: '#fff',
  fontSize: '25px',
  lineHeight: '1.4',
  fontWeight: 'bold',
  margin: '0',
};

const headerContentSubtitle = {
  color: '#878787',
  fontSize: '13px',
  margin: '13px 0',
};

const title = {
  margin: '15px 0',
  fontWeight: 'bold',
  fontSize: '15px',
  lineHeight: '15px',
  color: '#0c0d0e',
};

const paragraph = {
  fontSize: '13px',
  lineHeight: '21px',
  color: '#878787',
};

const footer = {
  textAlign: 'center' as const,
  maxWidth: '600px',
  margin: '0 auto',
  padding: '10px',
  backgroundColor: '#eee',
  color: '#878787',
  fontSize: '10px',
};

const header = {
  display: 'flex',
  flexDireciont: 'column',
  backgroundColor: '#000',
  padding: '20px 30px',
};

const footerDivider = {
  borderColor: '#ccc',
  borderStyle: 'solid',
  borderWidth: '1px',
  margin: ' 25px 0',
};
