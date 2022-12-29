import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';

export default function Email() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

  return (
    <Html>
      <Head />
      <Preview>
        The sales intelligence platform that helps you uncover qualified leads.
      </Preview>
      <Section style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/koala-logo.png`}
            width="170"
            height="50"
            alt="Koala"
            style={logo}
          />
          <Text style={paragraph}>Hi Zeno,</Text>
          <Text style={paragraph}>
            Welcome to Koala, the sales intelligence platform that helps you
            uncover qualified leads and close deals faster.
          </Text>
          <Section style={btnContainer}>
            <Button pX={12} pY={12} style={button} href="https://getkoala.com">
              Get started
            </Button>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />
            The Koala team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>408 Warren Rd - San Mateo, CA 94402</Text>
        </Container>
      </Section>
    </Html>
  );
}

const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontFamily,
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  fontFamily,
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  fontFamily,
  color: '#8898aa',
  fontSize: '12px',
};
