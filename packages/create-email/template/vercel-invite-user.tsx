import { Avatar, AvatarImage } from '@react-email/avatar';
import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Text } from '@react-email/text';
import { Preview } from '@react-email/preview';
import * as React from 'react';

export default function Email() {
  return (
    <Html>
      <Head />
      <Preview>Join bukinoshita on Vercel</Preview>
      <table
        style={box}
        width="100%"
        border={0}
        cellSpacing="0"
        cellPadding="0"
      >
        <tr>
          <td align="center">
            <Container style={container}>
              <div style={section}>
                <table
                  style={box}
                  width="100%"
                  border={0}
                  cellSpacing="0"
                  cellPadding="0"
                >
                  <tr>
                    <td align="center">
                      <div style={{ marginTop: '32px' }}>
                        <Img
                          src="https://demo.react.email/static/images/vercel-logo.png"
                          width="40"
                          height="37"
                          alt="Vercel"
                        />
                      </div>
                      <Heading as="h1" style={h1}>
                        Join <strong>My Project</strong> on{' '}
                        <strong>Vercel</strong>
                      </Heading>
                    </td>
                  </tr>
                </table>
                <Text style={text}>Hello zenorocha,</Text>
                <Text style={text}>
                  <strong>bukinoshita</strong> (
                  <Link href="mailto:bukinoshita@example.com" style={link}>
                    bukinoshita@example.com
                  </Link>
                  ) has invited you to the <strong>My Project</strong> team on{' '}
                  <strong>Vercel</strong>.
                </Text>
                <table
                  style={box}
                  width="100%"
                  border={0}
                  cellSpacing="0"
                  cellPadding="0"
                >
                  <tr>
                    <td align="center">
                      <table
                        style={spacing}
                        border={0}
                        cellPadding="0"
                        cellSpacing="10"
                      >
                        <tr>
                          <td style={center} align="left" valign="middle">
                            <Avatar>
                              <AvatarImage
                                style={avatar}
                                src="https://vercel.com/api/www/avatar/?u=zenorocha&amp;s=240&amp;format=png"
                                width="64"
                                height="64"
                              />
                            </Avatar>
                          </td>
                          <td style={center} align="left" valign="middle">
                            <Img
                              src="https://demo.react.email/static/images/vercel-arrow.png"
                              width="12"
                              height="9"
                              alt="invited you to"
                            />
                          </td>
                          <td style={center} align="left" valign="middle">
                            <Avatar>
                              <AvatarImage
                                style={avatar}
                                src="https://vercel.com/api/www/avatar/?teamId=team_3e17ZatpKJ1imLQdTyrLeBoX&amp;s=240&amp;format=png"
                                width="64"
                                height="64"
                              />
                            </Avatar>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  style={box}
                  width="100%"
                  border={0}
                  cellSpacing="0"
                  cellPadding="0"
                >
                  <tr>
                    <td align="center">
                      <div>
                        <Button
                          pX={20}
                          pY={12}
                          style={btn}
                          href="https://vercel.com/teams/invite/foo"
                        >
                          Join the team
                        </Button>
                      </div>
                    </td>
                  </tr>
                </table>
                <Text style={text}>
                  <br />
                  or copy and paste this URL into your browser:{' '}
                  <Link
                    href="https://vercel.com/teams/invite/foo"
                    target="_blank"
                    style={link}
                    rel="noreferrer"
                  >
                    https://vercel.com/teams/invite/foo
                  </Link>
                </Text>
                <Hr style={hr} />
                <Text style={footer}>
                  This invitation was intended for{' '}
                  <span style={black}>zenorocha</span>.This invite was sent from{' '}
                  <span style={black}>204.13.186.218</span> located in{' '}
                  <span style={black}>São Paulo, Brazil</span>. If you were not
                  expecting this invitation, you can ignore this email. If you
                  are concerned about your account's safety, please reply to
                  this email to get in touch with us.
                </Text>
              </div>
            </Container>
          </td>
        </tr>
      </table>
    </Html>
  );
}

const box = {
  width: '100% !important',
};

const container = {
  border: '1px solid #eaeaea',
  borderRadius: '5px',
  margin: '40px 0',
};

const section = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  textAlign: 'left' as const,
  width: '465px',
};

const h1 = {
  color: '#000',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'normal',
  margin: '30px 0',
  padding: '0',
};

const avatar = {
  borderRadius: '100%',
};

const link = {
  color: '#067df7',
  textDecoration: 'none',
};

const text = {
  color: '#000',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  lineHeight: '24px',
};

const black = {
  color: 'black',
};

const center = {
  verticalAlign: 'middle',
};

const btn = {
  backgroundColor: '#000',
  borderRadius: '5px',
  color: '#fff',
  display: 'inline-block',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '50px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const spacing = {
  marginBottom: '26px',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '26px 0',
  width: '100%',
};

const footer = {
  color: '#666666',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '24px',
};
