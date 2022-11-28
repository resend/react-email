import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Text } from '@react-email/text';
import { Preview } from '@react-email/preview';
import * as React from 'react';
import { Section } from '@react-email/section';

export default function Email() {
  return (
    <Html>
      <Head />
      <Preview>Notion Magic Link</Preview>
      <body style={body}>
        <Container style={container}>
          <Section>
            <Heading as="h1" style={h1}>
              Login
            </Heading>
          </Section>

          <Section>
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

            <Text style={{ ...text, marginBottom: '14px' }}>
              Or, copy and paste this temporary login code:
            </Text>

            <code style={code}>sparo-ndigo-amurt-secan</code>
          </Section>

          <Section>
            <Text
              style={{
                ...text,
                color: '#ababab',
                marginTop: '14px',
                marginBottom: '16px',
              }}
            >
              If you didn&apos;t try to login, you can safely ignore this email.
            </Text>
            <Text
              style={{
                ...text,
                color: '#ababab',
                marginTop: '12px',
                marginBottom: '38px',
              }}
            >
              Hint: You can set a permanent password in Settings & members → My
              account.
            </Text>
          </Section>

          <Section>
            <Img
              src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fff307fed-4664-46b0-8de1-6fdcc1e937b2%2FNotion-logo.png?table=block&id=83715d77-03ee-4b86-99b5-e659a4712dd8&spaceId=e12b42ac-4e54-476f-a4f5-7d6bdb1e61e2&width=40&userId=&cache=v2"
              width="32"
              height="32"
              alt="Notion's Logo"
            />
            <Text style={footer}>
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
            </Text>
          </Section>
        </Container>
      </body>
    </Html>
  );
}

const body = {
  padding: 0,
  margin: 0,
  backgroundColor: 'white',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  paddingLeft: '64px',
  paddingRight: '64px',
  paddingTop: '32px',
};

const h1 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};

const text = {
  color: '#333',
  fontSize: '14px',
  margin: '24px 0',
};

const footer = {
  color: '#898989',
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
