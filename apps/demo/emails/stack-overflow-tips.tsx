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

  return (
    <Html>
      <Head />
      <Preview>Stack overflow tips for searching</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width={146}
              src={`${baseUrl}/static/stack-overflow-logo.png`}
            />
          </Section>
          <Section style={header}>
            <Column>
              <Section style={headerContent}>
                <Text style={headerContentTitle}>
                  Find what you want, faster
                </Text>
                <Text style={headerContentSubtitle}>
                  Tips and tricks for searching on Stack Overflow
                </Text>
              </Section>
              <Section style={headerImageContainer}>
                <Img
                  width={340}
                  src={`${baseUrl}/static/stack-overflow-header.png`}
                />
              </Section>
            </Column>
          </Section>

          <Section style={content}>
            <Text style={title}>Searching for solutions</Text>
            <Text style={paragraph}>
              With more than 18 million questions, it's possible that someone
              has already provided a solution to the problem you're facing.{' '}
            </Text>

            <Hr style={divider} />

            <Text style={title}>
              Use the search bar at the top of the page to find what you need
            </Text>
            <Text style={paragraph}>
              Here are a few simple search tips to get you started:
            </Text>
            <ul>
              <li>
                <Text style={paragraph}>
                  To find a specific phrase, enter it in quotes: "local storage"
                </Text>
              </li>
              <li>
                <Text style={paragraph}>
                  To search within specific tag(s), enter them in square
                  brackets: [javascript]
                </Text>
              </li>
              <li>
                <Text style={paragraph}>
                  Combine them to get even more precise results - [javascript]
                  "local storage" searches for the phrase “local storage” in
                  questions that have the [javascript] tag
                </Text>
              </li>
            </ul>

            <Text style={paragraph}>
              The more information you can put in the search bar, the more
              likely you will be to either find the answer you need or feel
              confident that no one else has asked the question before.
            </Text>

            <Hr style={divider} />

            <Text style={title}>
              Take a break and read about the worst coder in the world
            </Text>

            <Section style={buttonContainer}>
              <Link
                style={button}
                href="https://stackoverflow.blog/2019/10/22/"
              >
                I need a break
              </Link>
            </Section>
          </Section>
        </Container>

        <Section style={footer}>
          <Text style={footerText}>
            You're receiving this email because your Stack Overflow activity
            triggered this tip or reminder.
          </Text>

          <Text style={footerLink}>Unsubscribe from emails like this </Text>
          <Text style={footerLink}>Edit email settings </Text>
          <Text style={footerLink}>Contact us</Text>
          <Text style={footerLink}>Privacy</Text>

          <Hr style={footerDivider} />

          <Img
            width={111}
            src={`${baseUrl}/static/stack-overflow-logo-sm.png`}
          />
          <Text style={footerAddress}>
            <b>Stack Overflow</b>, 110 William Street, 28th Floor, New York, NY
            10038
          </Text>
          <Text style={footerHeart}>{'<3'}</Text>
        </Section>
      </Section>
    </Html>
  );
}

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#f3f3f5',
  fontFamily,
};

const headerContent = { padding: '20px 30px 15px' };

const headerContentTitle = {
  color: '#fff',
  fontSize: '27px',
  fontWeight: 'bold',
  lineHeight: '27px',
};

const headerContentSubtitle = {
  color: '#fff',
  fontSize: '17px',
};

const headerImageContainer = {
  padding: '30px 10px',
};

const title = {
  margin: '0 0 15px',
  fontWeight: 'bold',
  fontSize: '21px',
  lineHeight: '21px',
  color: '#0c0d0e',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '21px',
  color: '#3c3f44',
};

const divider = {
  margin: '30px 0',
};

const container = {
  maxWidth: '680px',
  width: '100%',
  margin: '0 auto',
  backgroundColor: '#ffffff',
};

const footer = {
  width: '680px',
  margin: '32px auto 0 auto',
  padding: '0 30px',
};

const content = {
  padding: '30px 30px 40px 30px',
};

const logo = {
  display: 'flex',
  background: '#f3f3f5',
  padding: '20px 30px',
};

const header = {
  borderRadius: '5px 5px 0 0',
  display: 'flex',
  flexDireciont: 'column',
  backgroundColor: '#2b2d6e',
};

const buttonContainer = {
  marginTop: '24px',
  display: 'block',
};

const button = {
  backgroundColor: '#0095ff',
  border: '1px solid #0077cc',
  fontSize: '17px',
  lineHeight: '17px',
  padding: '13px 17px',
  borderRadius: '4px',
  maxWidth: '120px',
  color: '#fff',
};

const footerDivider = {
  ...divider,
  borderColor: '#d6d8db',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '15px',
  color: '#9199a1',
  margin: '0',
};

const footerLink = {
  display: 'inline-block',
  color: '#9199a1',
  textDecoration: 'underline',
  fontSize: '12px',
  marginRight: '10px',
  marginBottom: '0',
  marginTop: '8px',
};

const footerAddress = {
  margin: '4px 0',
  fontSize: '12px',
  lineHeight: '15px',
  color: '#9199a1',
};

const footerHeart = {
  borderRadius: '1px',
  border: '1px solid #d6d9dc',
  padding: '4px 6px 3px 6px',
  fontSize: '11px',
  lineHeight: '11px',
  fontFamily: 'Consolas,monospace',
  color: '#e06c77',
  maxWidth: 'min-content',
  margin: '0 0 32px 0',
};
