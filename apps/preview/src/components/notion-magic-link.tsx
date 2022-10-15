import { Code } from '@react-email/code';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { P } from '@react-email/p';
import { Preview } from '@react-email/preview';
import * as React from 'react';

interface NotionMagicLinkProps {}

export const NotionMagicLink: React.FC<Readonly<NotionMagicLinkProps>> = () => {
  return (
    <Html>
      <Head />
      <Preview>Notion Magic Link</Preview>
      <body style={body}>
        <table
          style={box}
          width="100%"
          border={0}
          cellSpacing="0"
          cellPadding="0"
          align="center"
        >
          <tr>
            <td>
              <Container>
                <div style={section}>
                  <table
                    style={box}
                    width="100%"
                    border={0}
                    cellSpacing="0"
                    cellPadding="0"
                    role="presentation"
                  >
                    <tr>
                      <td style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                        <Heading as="h1" style={h1}>
                          Login
                        </Heading>

                        <Link
                          href="https://notion.so"
                          target="_blank"
                          style={{
                            ...link,
                            display: 'block',
                            marginBottom: '16px',
                          }}
                        >
                          Click here to log in with this magic link
                        </Link>

                        <P style={{ ...text, marginBottom: '14px' }}>
                          Or, copy and paste this temporary login code:
                        </P>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                        <table
                          width="100%"
                          border={0}
                          cellSpacing="0"
                          cellPadding="0"
                          role="presentation"
                        >
                          <tr>
                            <td style={code}>
                              <Code style={{ display: 'block' }}>
                                sparo-ndigo-amurt-secan
                              </Code>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                        <P
                          style={{
                            ...text,
                            color: '#ababab',
                            marginTop: '14px',
                            marginBottom: '16px',
                          }}
                        >
                          If you didn&apos;t try to login, you can safely ignore
                          this email.
                        </P>
                        <P
                          style={{
                            ...text,
                            color: '#ababab',
                            marginTop: '12px',
                            marginBottom: '38px',
                          }}
                        >
                          Hint: You can set a permanent password in Settings &
                          members → My account.
                        </P>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                        <Img
                          src="https://www.notion.so/images/logo_64@2x.png"
                          width="32"
                          height="32"
                          alt="Notion's Logo"
                        />
                        <P style={footer}>
                          <Link
                            href="https://notion.so"
                            target="_blank"
                            style={{ ...link, color: '#898989' }}
                          >
                            Notion.so
                          </Link>
                          , the all-in-one-workspace
                          <br />
                          for your notes, tasks, wikis, and databases.
                        </P>
                      </td>
                    </tr>
                  </table>
                </div>
              </Container>
            </td>
          </tr>
        </table>
      </body>
    </Html>
  );
};

const body = {
  padding: 0,
  margin: 0,
};

const box = {
  width: '100% !important',
  maxWidth: '600px',
};

const section = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  textAlign: 'left' as const,
  maxWidth: '600px',
  width: '100%',
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '123px 0 44px',
  padding: '0',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333',
};

export default NotionMagicLink;
