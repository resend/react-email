import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';

interface EmailProps {
  validationCode: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function Email({ validationCode = 'DJZ-TLX' }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`${baseUrl}/static/slack-logo.png`}
              width="120"
              height="36"
              alt="Slack"
            />
          </Section>
          <Text style={h1}>Confirm your email address</Text>
          <Text style={heroText}>
            Your confirmation code is below - enter it in your open browser
            window and we'll help you get signed in.
          </Text>

          <Section style={codeBox}>
            <Text style={confirmationCodeText}>{validationCode}</Text>
          </Section>

          <Text style={text}>
            If you didn't request this email, there's nothing to worry about -
            you can safely ignore it.
          </Text>

          <table
            style={footerLogos}
            border={0}
            cellPadding="0"
            cellSpacing="10"
            align="left"
          >
            <tr>
              <td align="left" valign="top">
                <Img
                  src={`${baseUrl}/static/slack-logo.png`}
                  width="120"
                  height="36"
                  alt="Slack"
                />
              </td>
              <td align="right" valign="top">
                <Link href="https://twitter.com/slackhq">
                  <Img
                    src={`${baseUrl}/static/slack-twitter.png`}
                    width="32"
                    height="32"
                    alt="Slack"
                    style={socialMediaIcon}
                  />
                </Link>
                <Link href="https://facebook.com/slackhq">
                  <Img
                    src={`${baseUrl}/static/slack-facebook.png`}
                    width="32"
                    height="32"
                    alt="Slack"
                    style={socialMediaIcon}
                  />
                </Link>
                <Link href="https://www.linkedin.com/company/tiny-spec-inc/">
                  <Img
                    src={`${baseUrl}/static/slack-linkedin.png`}
                    width="32"
                    height="32"
                    alt="Slack"
                    style={socialMediaIcon}
                  />
                </Link>
              </td>
            </tr>
          </table>

          <Section style={footerText}>
            <Link
              style={footerLink}
              href="https://slackhq.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our blog
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              style={footerLink}
              href="https://slack.com/legal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Policies
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              style={footerLink}
              href="https://slack.com/help"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help center
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              style={footerLink}
              href="https://slack.com/community"
              target="_blank"
              rel="noopener noreferrer"
              data-auth="NotApplicable"
              data-linkindex="6"
            >
              Slack Community
            </Link>
            <Text style={footerText}>
              ©2022 Slack Technologies, LLC, a Salesforce company. <br />
              500 Howard Street, San Francisco, CA 94105, USA <br />
              <br />
              All rights reserved.
            </Text>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

const footerText = {
  fontSize: '12px',
  color: '#b7b7b7',
  lineHeight: '15px',
  textAlign: 'left' as const,
  marginBottom: '50px',
};

const footerLink = {
  color: '#b7b7b7',
  textDecoration: 'underline',
};

const footerLogos = {
  marginBottom: '32px',
  width: '100%',
};

const socialMediaIcon = {
  display: 'inline',
  marginLeft: '32px',
};

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
};

const logoContainer = {
  marginTop: '32px',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
};

const heroText = {
  fontSize: '20px',
  lineHeight: '28px',
  marginBottom: '30px',
};

const codeBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '4px',
  marginRight: '50px',
  marginBottom: '30px',
  padding: '43px 23px',
};

const confirmationCodeText = {
  fontSize: '30px',
  textAlign: 'center' as const,
  verticalAlign: 'middle',
};

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
};
