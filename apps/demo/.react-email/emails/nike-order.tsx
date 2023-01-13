import { Button } from '@react-email/button';
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
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

  return (
    <Html>
      <Head />
      <Preview>Nike</Preview>
      <Section style={main}>
        <Container style={container}>
          <Container style={track}>
            <Container style={{ float: 'left' }}>
              <Text style={{ ...paragraph, fontWeight: 'bold' }}>
                Tracking Number
              </Text>
              <Text style={trackNumber}>1ZV218970300071628</Text>
            </Container>
            <Container style={{ float: 'right', marginTop: '3px' }}>
              <Link style={button}>Track Package</Link>
            </Container>
            <Container style={{ clear: 'both' }} />
          </Container>
          <Hr style={hr} />
          <Container style={body}>
            <Img
              src={`${baseUrl}/static/nike-logo.png`}
              width="66"
              height="22"
              alt="Nike"
              style={{ margin: 'auto' }}
            />
            <Text style={heading}>It's On Its Way.</Text>
            <Text style={text}>
              You order's is on its way. Use the link above to track its
              progress.
            </Text>
            <Text style={{ ...text, marginTop: 24 }}>
              We´ve also charged your payment method for the cost of your order
              and will be removing any authorization holds. For payment details,
              please visit your Orders page on Nike.com or in the Nike app.
            </Text>
          </Container>
          <Hr style={hr} />
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
  fontFamily,
  margin: '10px auto',
  width: '580px',
  border: '1px solid #E5E5E5',
};

const track = {
  padding: '22px 40px',
  backgroundColor: '#F7F7F7',
};

const trackNumber = {
  margin: '12px 0 0 0',
  fontWeight: 500,
  lineHeight: '1.4',
  color: '#6F6F6F',
};

const trackInfos = {};

const body = {
  padding: '40px 74px',
  textAlign: 'center',
};

const adress = {};

const product = {};

const order = {};

const heading = {
  fontFamily,
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  textAlign: 'center',
  letterSpacing: '-1px',
};

const paragraph = {
  fontFamily,
  margin: '0',
  lineHeight: '2',
};

const text = {
  ...paragraph,
  color: '#747474',
  fontWeight: '500',
};

const button = {
  fontFamily,
  border: '1px solid #929292',
  fontSize: '16px',
  textDecoration: 'none',
  padding: '10px 0px',
  width: '220px',
  display: 'block',
  textAlign: 'center',
  fontWeight: 500,
  color: '#000',
};

const hr = {
  borderColor: '#E5E5E5',
};

const footer = {};
