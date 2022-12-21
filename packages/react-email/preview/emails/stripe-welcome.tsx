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
  return (
    <Html>
      <Head />
      <Preview>You're now ready to make live transactions with Stripe!</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src="https://assets.react.email/demo/stripe-logo.png"
              width="49"
              height="21"
              alt="Stripe"
            />
            <Hr style={hr} />
            <Text style={paragraph}>
              Thanks for submitting your account information. You're now ready
              to make live transactions with Stripe!
            </Text>
            <Text style={paragraph}>
              You can view your payments and a variety of other information
              about your account right from your dashboard.
            </Text>
            <Button
              pX={10}
              pY={10}
              style={button}
              href="https://dashboard.stripe.com/login"
            >
              View your Stripe Dashboard
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              If you haven't finished your integration, you might find our{' '}
              <Link style={anchor} href="https://stripe.com/docs">
                docs
              </Link>{' '}
              handy.
            </Text>
            <Text style={paragraph}>
              Once you're ready to start accepting payments, you'll just need to
              use your live{' '}
              <Link
                style={anchor}
                href="https://dashboard.stripe.com/login?redirect=%2Fapikeys"
              >
                API keys
              </Link>{' '}
              instead of your test API keys. Your account can simultaneously be
              used for both test and live requests, so you can continue testing
              while accepting live payments. Check out our{' '}
              <Link style={anchor} href="https://stripe.com/docs/dashboard">
                tutorial about account basics
              </Link>
              .
            </Text>
            <Text style={paragraph}>
              Finally, we've put together a{' '}
              <Link
                style={anchor}
                href="https://stripe.com/docs/checklist/website"
              >
                quick checklist
              </Link>{' '}
              to ensure your website conforms to card network standards.
            </Text>
            <Text style={paragraph}>
              We'll be here to help you with any step along the way. You can
              find answers to most questions and get in touch with us on our{' '}
              <Link style={anchor} href="https://support.stripe.com/">
                support site
              </Link>
              .
            </Text>
            <Text style={paragraph}>— The Stripe team</Text>
            <Hr style={hr} />
            <Text style={footer}>
              Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080
            </Text>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: '#525f7f',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const anchor = {
  color: '#556cd6',
};

const button = {
  backgroundColor: '#656ee8',
  borderRadius: '5px',
  color: '#fff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
};

const footer = {
  color: '#8898aa',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
};
