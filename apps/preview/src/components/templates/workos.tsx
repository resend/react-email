import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Text } from '@react-email/text';
import { Preview } from '@react-email/preview';
import * as React from 'react';
import { Ul } from '@react-email/ul';
import { Hr } from '@react-email/hr';

export const WorkOS: React.FC<Readonly<any>> = () => {
  return (
    <Html>
      <Head />
      <Preview>Notion Magic Link</Preview>
      <body style={body}>
        <Container style={container}>
          <Img src="/static/images/workos-logo.png" width="125" />
          <Heading as="h1" style={h1}>
            SSO connection linked
          </Heading>
          <Text style={text}>
            A new Single Sign-On connection has been successfully linked to your
            WorkOS project:
          </Text>

          <Ul>
            <li style={text}>
              <strong style={strong}>Environment: </strong>
              Sandbox
            </li>
            <li style={text}>
              <strong style={strong}>Connection: </strong>
              Test replays (Okta)
            </li>
          </Ul>

          <Button href="/" style={button} pX={12} pY={6.5}>
            View Connection
          </Button>

          <Hr style={divider} />

          <Text style={anotherText}>
            If you’re having trouble with the button above,{' '}
            <Link href="/" style={link}>
              open in your web browser
            </Link>
            .
          </Text>

          <Text style={anotherText}>
            <Link href="/" style={link}>
              Unsubscribe
            </Link>{' '}
            or{' '}
            <Link href="/" style={link}>
              manage email preferences
            </Link>
          </Text>
        </Container>
      </body>
    </Html>
  );
};

const body = {
  background: '#FCFCFC',
  paddingTop: '100px',
  fontFamily:
    "Untitled sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: '518px',
  background: '#fff',
  border: '1px solid #E8E7E9',
  borderRadius: '8px',
  margin: 'auto',
  padding: '40px',
};

const h1 = {
  color: '#14141A',
  fontSize: '24px',
  fontWeight: '500',
  lineHeight: '33.12px',
  letterSpacing: '-3%',
  marginTop: '32px !important',
  marginBottom: '12px !important',
};

const text = {
  color: '#14141A',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '22.08px',
  margin: '0',
};

const button = {
  backgroundColor: '#6565EC',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-flex',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '50px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const divider = {
  border: 'none',
  borderTop: '1px solid #E8E7E9',
  margin: '32px 0',
  width: '100%',
};

const anotherText = {
  color: '#6C6D75',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '16.56px',
};

const link = {
  color: '#5055D7',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '16.56px',
};

const strong = {
  fontWeight: '500',
};
