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
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

  return (
    <Html>
      <Head />
      <Preview>Read Alex's review</Preview>
      <Section style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/airbnb-logo.png`}
            width="96"
            height="30"
            alt="Airbnb"
          />
          <Section>
            <Img
              src={`${baseUrl}/static/airbnb-review-user.jpg`}
              width="96"
              height="96"
              alt="Alex"
              style={userImage}
            />
          </Section>
          <Text style={heading}>Here's what Alex wrote</Text>
          <Text style={review}>
            “Zeno was a great guest! Easy communication, the apartment was left
            in great condition, very polite, and respectful of all house rules.
            He’s welcome back anytime and would easily recommend him to any
            host!”
          </Text>
          <Text style={paragraph}>
            Now that the review period is over, we’ve posted Alex’s review to
            your Airbnb profile.
          </Text>
          <Text style={paragraph}>
            While it’s too late to write a review of your own, you can send your
            feedback to Alex using your Airbnb message thread.
          </Text>
          <Section style={{ padding: '16px 0 20px' }}>
            <Button pY={19} style={button} href="https://airbnb.com/">
              Send My Feedback
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={{ ...paragraph, fontWeight: '700' }}>
            Common questions
          </Text>
          <Text>
            <Link href="https://airbnb.com/help/article/13" style={link}>
              How do reviews work?
            </Link>
          </Text>
          <Text>
            <Link href="https://airbnb.com/help/article/1257" style={link}>
              How do star ratings work?
            </Link>
          </Text>
          <Text>
            <Link href="https://airbnb.com/help/article/995" style={link}>
              Can I leave a review after 14 days?
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Airbnb, Inc., 888 Brannan St, San Francisco, CA 94103
          </Text>
          <Link href="https://airbnb.com" style={reportLink}>
            Report unsafe behavior
          </Link>
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
  width: '580px',
};

const userImage = {
  margin: '0 auto',
  marginBottom: '16px',
  borderRadius: '50%',
};

const heading = {
  fontFamily,
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontFamily,
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
};

const review = {
  ...paragraph,
  padding: '24px',
  backgroundColor: '#f2f3f3',
  borderRadius: '4px',
};

const button = {
  fontFamily,
  backgroundColor: '#ff5a5f',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '18px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
};

const link = {
  ...paragraph,
  color: '#ff5a5f',
  display: 'block',
};

const reportLink = {
  fontFamily,
  fontSize: '14px',
  color: '#9ca299',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  fontFamily,
  color: '#9ca299',
  fontSize: '14px',
  marginBottom: '10px',
};
