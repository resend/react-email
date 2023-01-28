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

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function Email() {
  return (
    <Html>
      <Head />
      <Preview>Google Play developers</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section>
            <Section style={headerBlue}>
              <Img
                src={`${baseUrl}/static/google-play-header.png`}
                width="305"
                height="28"
                alt="Google Play developers header blue transparent"
              />
            </Section>
            <Section style={sectionLogo}>
              <Img
                src={`${baseUrl}/static/google-play-logo.png`}
                width="155"
                height="31"
                alt="Google Play"
              />
            </Section>
          </Section>

          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={heading}>DEVELOPER UPDATE</Text>
            <Text style={paragraph}>Hello Google Play Developer,</Text>
            <Text style={paragraph}>
              We strive to make Google Play a safe and trusted experience for
              users.
            </Text>
            <Text style={paragraph}>
              We've added clarifications to our{' '}
              <Link href="https://notifications.google.com" style={link}>
                Target API Level policy
              </Link>
              . Because this is a clarification, our enforcement standards and
              practices for this policy remain the same.
            </Text>
            <Section style={paragraphList}>
              <Text style={paragraph}>
                We’re noting exceptions to the{' '}
                <Link href="https://notifications.google.com" style={link}>
                  Target API Level policy
                </Link>
                , which can be found in our updated{' '}
                <Link href="https://notifications.google.com" style={link}>
                  Help Center article.
                </Link>
                These exceptions include permanently private apps and apps that
                target automotive or wearables form factors and are bundled
                within the same package.{' '}
                <Link href="https://notifications.google.com" style={link}>
                  Learn more
                </Link>
              </Text>
            </Section>
            <Text style={paragraph}>
              We’re also extending the deadline to give you more time to adjust
              to these changes. Now, apps that target API level 29 or below will
              start experiencing reduced distribution starting{' '}
              <b>Jan 31, 2023</b> instead of Nov 1, 2022. If you need more time
              to update your app, you can request an extension to keep your app
              discoverable to all users until May 1, 2023.
            </Text>
            <Hr style={hr} />
          </Section>

          <Section style={paragraphContent}>
            <Text style={paragraph}>Thank you,</Text>
            <Text style={{ ...paragraph, fontSize: '20px' }}>
              The Google Play team
            </Text>
          </Section>

          <Section style={containerContact}>
            <Section
              style={{
                padding: '20px 20px',
              }}
            >
              <Text style={paragraph}>Connect with us</Text>
              <table>
                <tr>
                  <td>
                    <Link href="https://notifications.google.com">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/static/google-play-chat.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://notifications.google.com">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/static/google-play-icon.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://notifications.google.com">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/static/google-play-academy.png`}
                      />
                    </Link>
                  </td>
                </tr>
              </table>
            </Section>
            <Img
              width="540"
              height="48"
              src={`${baseUrl}/static/google-play-footer.png`}
            />
          </Section>

          <Section style={{ ...paragraphContent, paddingBottom: 30 }}>
            <Text
              style={{
                ...paragraph,
                fontSize: '12px',
                textAlign: 'center',
                margin: 0,
              }}
            >
              © 2022 Google LLC 1600 Amphitheatre Parkway, Mountain View, CA
              94043, USA
            </Text>
            <Text
              style={{
                ...paragraph,
                fontSize: '12px',
                textAlign: 'center',
                margin: 0,
              }}
            >
              You have received this mandatory email service announcement to
              update you about important changes to your Google Play Developer
              account.
            </Text>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

const main = {
  backgroundColor: '#dbddde',
};

const sectionLogo = {
  padding: '0 40px',
};

const headerBlue = {
  display: 'flex',
  justifyContent: 'end',
  marginTop: -1,
  marginRight: -2,
  overflow: 'hidden',
};

const container = {
  margin: '30px auto',
  width: '610px',
  backgroundColor: '#fff',
  borderRadius: 5,
  overflow: 'hidden',
};

const containerContact = {
  backgroundColor: '#f0fcff',
  width: '90%',
  borderRadius: '5px',
  overflow: 'hidden',
  marginBottom: 20,
};

const heading = {
  fontFamily,
  fontSize: '14px',
  lineHeight: '26px',
  fontWeight: '700',
  color: '#004dcf',
};

const paragraphContent = {
  padding: '0 40px',
};

const paragraphList = {
  paddingLeft: 40,
};

const paragraph = {
  fontFamily,
  fontSize: '14px',
  lineHeight: '22px',
  color: '#3c4043',
};

const link = {
  ...paragraph,
  color: '#004dcf',
};

const hr = {
  borderColor: '#e8eaed',
  margin: '20px 0',
};
