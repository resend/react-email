import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Column } from '@react-email/column';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';

export default function Email() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

  return (
    <Html>
      <Head />
      <Preview>You updated the password for your Twitch account</Preview>
      <Section style={main}>
        <Column style={columnDirection}>
          <Container style={container}>
            <Section style={logo}>
              <Column style={columnDirection}>
                <Img width={114} src={`${baseUrl}/static/twitch-logo.png`} />
              </Column>
            </Section>
            <Section>
              <Column style={{width: '100%'}}>
                <Container style={sectionBorder}></Container>
                <Container style={sectionCenter}></Container>
                <Container style={sectionBorder}></Container>
              </Column>
            </Section>
            <Section style={content}>
              <Column style={{ ...columnDirection, ...alignLeft }}>
                <Text style={paragraph}>Hi zenorocha,</Text>
                <Text style={paragraph}>
                  You updated the password for your Twitch account on June 23,
                  2022 4:06:00 pm UTC. If this was you, then no further action
                  is required.
                </Text>
                <Text style={paragraph}>
                  However if you did NOT perform this password change, please
                  <Link href="#" style={link}>
                    {' '}
                    reset your account password
                  </Link>{' '}
                  immediately.
                </Text>
                <Text style={paragraph}>
                  Remember to use a password that is both strong and unique to
                  your Twitch account. To learn more about how to create a
                  strong and unique password,
                  <Link href="#" style={link}>
                    {' '}
                    click here.
                  </Link>
                </Text>
                <Text style={paragraph}>
                  Still have questions? Please contact
                  <Link href="#" style={link}>
                    {' '}
                    Twitch Support
                  </Link>
                </Text>
                <Text style={paragraph}>
                  Thanks,
                  <br />
                  Twitch Support Team
                </Text>
              </Column>
            </Section>
          </Container>

          <Section style={footer}>
            <Column style={columnDirection}>
              <div style={iconsSocial}>
                <Img src={`${baseUrl}/static/twitch-icon-twitter.png`} />
                <Img src={`${baseUrl}/static/twitch-icon-facebook.png`} />
              </div>
              <Text style={{ textAlign: 'center', color: '#706a7b' }}>
                © 2022 Twitch, All Rights Reserved <br />
                350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA
              </Text>
            </Column>
          </Section>
        </Column>
      </Section>
    </Html>
  );
}

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  width: '580px',
  margin: '30px auto',
  backgroundColor: '#ffffff',
};

const footer = {
  width: '580px',
  margin: '0 auto',
};

const content = {
  padding: '5px 50px 10px 60px',
};

const logo = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 30,
};

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '100%',
};

const sectionCenter = {
  borderBottom: '1px solid rgb(145,71,255)',
  minWidth: '102px',
};

const columnDirection = {
  display: 'flex',
  flexDirection: 'column',
} as React.CSSProperties;

const alignLeft = {
  ...columnDirection,
  alignItems: 'start',
};

const iconsSocial = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 15,
};

const link = {
  textDecoration: 'underline',
};
