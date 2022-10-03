import { Link } from '@react-email/link';
import { Button } from '@react-email/button';
import { Code } from '@react-email/code';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { P } from '@react-email/p';
import { Preview } from '@react-email/preview';
import * as React from 'react';

interface VercelInviteUserProps {}

export const VercelInviteUser: React.FC<
  Readonly<VercelInviteUserProps>
> = () => {
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
                          src="https://assets.vercel.com/email/vercel.png"
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
                <P style={text}>Hello zenorocha,</P>
                <P style={text}>
                  <strong>bukinoshita</strong> (
                  <Link href="mailto:bukinoshita@example.com" style={link}>
                    bukinoshita@example.com
                  </Link>
                  ) has invited you to the <strong>My Project</strong> team on{' '}
                  <strong>Vercel</strong>.
                </P>
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
                            <Img
                              style={primaryAvatar}
                              src="https://vercel.com/api/www/avatar/?u=zenorocha&amp;s=240&amp;format=png"
                              width="60"
                              height="60"
                              alt="zenorocha"
                            />
                          </td>
                          <td style={center} align="left" valign="middle">
                            <Img
                              src="https://assets.vercel.com/email/team-invite-arrow.png"
                              width="12"
                              height="9"
                              alt="invited you to"
                            />
                          </td>
                          <td style={center} align="left" valign="middle">
                            <Img
                              style={secondaryAvatar}
                              src="https://vercel.com/api/www/avatar/?teamId=team_3e17ZatpKJ1imLQdTyrLeBoX&amp;s=240&amp;format=png"
                              width="60"
                              height="60"
                              alt="My Project"
                            />
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
                          style={btn}
                          href="https://vercel.com/teams/invite/foo"
                        >
                          JOIN TEAM
                        </Button>
                      </div>
                    </td>
                  </tr>
                </table>
                <P style={text}>
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
                </P>
                <P style={text}>
                  <br />
                  or execute the command below:
                </P>
                <Code style={code}>vercel join my-project-fzsQbPqFEW</Code>
                <Hr style={hr} />
                <P style={footer}>
                  This invitation was intended for{' '}
                  <span style={black}>zenorocha</span>.This invite was sent from{' '}
                  <span style={black}>204.13.186.218</span> located in{' '}
                  <span style={black}>São Paulo, Brazil</span>. If you were not
                  expecting this invitation, you can ignore this email. If you
                  are concerned about your account's safety, please reply to
                  this email to get in touch with us.
                </P>
              </div>
            </Container>
          </td>
        </tr>
      </table>
    </Html>
  );
};

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

const primaryAvatar = {
  borderRadius: '50%',
  overflow: 'hidden',
};

const secondaryAvatar = {
  borderRadius: '50%',
  overflow: 'hidden',
  border: '1px solid #eaeaea',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12)',
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
  width: '200px',
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

const code = {
  display: 'inline-block',
  padding: '16px',
  width: '100%',
  backgroundColor: '#000',
  borderRadius: '5px',
  color: '#fff',
};

export default VercelInviteUser;
