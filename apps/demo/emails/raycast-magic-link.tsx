import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';

export default function Email() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

  return (
    <Html>
      <Head />
      <Preview>Log in with this magic link.</Preview>
      <Section style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/raycast-logo.png`}
            width={48}
            height={48}
            alt="Raycast"
          />
          <Text style={heading}>🪄 Your magic link</Text>
          <Section style={body}>
            <Text style={paragraph}>
              <Link style={link} href="https://raycast.com">
                👉 Click here to sign in 👈
              </Link>
            </Text>
            <Text style={paragraph}>
              If you didn't request this, please ignore this email.
            </Text>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />- Raycast Team
          </Text>
          <Hr style={hr} />
          <Img
            src={`${baseUrl}/static/raycast-logo.png`}
            width={32}
            height={32}
            style={{
              WebkitFilter: 'grayscale(100%)',
              filter: 'grayscale(100%)',
              margin: '20px 0',
            }}
          />
          <Text style={footer}>Raycast Technologies Inc.</Text>
          <Text style={footer}>
            2093 Philadelphia Pike #3222, Claymont, DE 19703
          </Text>
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
  padding: '20px 25px 48px',
  backgroundImage: 'url("/assets/raycast-bg.png")',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat, no-repeat',
};

const heading = {
  fontFamily,
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
};

const body = {
  margin: '24px 0',
};

const paragraph = {
  fontFamily,
  fontSize: '16px',
  lineHeight: '26px',
};

const link = {
  color: '#FF6363',
};

const hr = {
  borderColor: '#dddddd',
  marginTop: '48px',
};

const footer = {
  fontFamily,
  color: '#8898aa',
  fontSize: '12px',
  marginLeft: '4px',
};
