import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmailProps {
  username: string;
  userImage: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  teamImage: string;
  inviteLink: string;
  inviteFromIp: string;
  inviteFromLocation: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function Email({
  username = 'zenorocha',
  userImage = `${baseUrl}/static/vercel-user.png`,
  invitedByUsername = 'bukinoshita',
  invitedByEmail = 'bukinoshita@example.com',
  teamName = 'My Project',
  teamImage = `${baseUrl}/static/vercel-team.png`,
  inviteLink = 'https://vercel.com/teams/invite/foo',
  inviteFromIp = '204.13.186.218',
  inviteFromLocation = 'São Paulo, Brazil',
}: EmailProps) {
  const previewText = `Join ${invitedByUsername} on Vercel`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ marginTop: '32px' }}>
            <Img
              src={`${baseUrl}/static/vercel-logo.png`}
              width="40"
              height="37"
              alt="Vercel"
              style={logo}
            />
          </Section>
          <Heading style={h1}>
            Join <strong>{teamName}</strong> on <strong>Vercel</strong>
          </Heading>
          <Text style={text}>Hello {username},</Text>
          <Text style={text}>
            <strong>bukinoshita</strong> (
            <Link href={`mailto:${invitedByEmail}`} style={link}>
              {invitedByEmail}
            </Link>
            ) has invited you to the <strong>{teamName}</strong> team on{' '}
            <strong>Vercel</strong>.
          </Text>
          <Section>
            <Row>
              <Column align="right">
                <Img style={avatar} src={userImage} width="64" height="64" />
              </Column>
              <Column align="center">
                <Img
                  src={`${baseUrl}/static/vercel-arrow.png`}
                  width="12"
                  height="9"
                  alt="invited you to"
                />
              </Column>
              <Column align="left">
                <Img style={avatar} src={teamImage} width="64" height="64" />
              </Column>
            </Row>
          </Section>
          <Section
            style={{
              textAlign: 'center',
              marginTop: '26px',
              marginBottom: '26px',
            }}
          >
            <Button pX={20} pY={12} style={btn} href={inviteLink}>
              Join the team
            </Button>
          </Section>
          <Text style={text}>
            or copy and paste this URL into your browser:{' '}
            <Link
              href={inviteLink}
              target="_blank"
              style={link}
              rel="noreferrer"
            >
              {inviteLink}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This invitation was intended for{' '}
            <span style={black}>{username} </span>.This invite was sent from{' '}
            <span style={black}>{inviteFromIp}</span> located in{' '}
            <span style={black}>{inviteFromLocation}</span>. If you were not
            expecting this invitation, you can ignore this email. If you are
            concerned about your account's safety, please reply to this email to
            get in touch with us.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  border: '1px solid #eaeaea',
  borderRadius: '5px',
  margin: '40px auto',
  padding: '20px',
  width: '465px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#000',
  fontSize: '24px',
  fontWeight: 'normal',
  textAlign: 'center' as const,
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
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '50px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const hr = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '26px 0',
  width: '100%',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '24px',
};
