import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const GooglePlayPolicyUpdateEmail = () => (
  <Html>
    <Head />
    <Preview>Google Play developers</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section>
          <Row>
            <Column>
              <Img
                alt="Google Play developers header blue transparent"
                height="28"
                src={`${baseUrl}/static/google-play-header.png`}
                style={headerBlue}
                width="305"
              />
              <Img
                alt="Google Play"
                height="31"
                src={`${baseUrl}/static/google-play-logo.png`}
                style={sectionLogo}
                width="155"
              />
            </Column>
          </Row>
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
        </Section>
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
            target automotive or wearables form factors and are bundled within
            the same package.{' '}
            <Link href="https://notifications.google.com" style={link}>
              Learn more
            </Link>
          </Text>
        </Section>
        <Section style={paragraphContent}>
          <Text style={paragraph}>
            We’re also extending the deadline to give you more time to adjust to
            these changes. Now, apps that target API level 29 or below will
            start experiencing reduced distribution starting <b>Jan 31, 2023</b>{' '}
            instead of Nov 1, 2022. If you need more time to update your app,
            you can request an extension to keep your app discoverable to all
            users until May 1, 2023.
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
          <Row>
            <Text style={paragraph}>Connect with us</Text>
          </Row>
          <Row
            align="left"
            style={{
              width: '84px',
              float: 'left',
            }}
          >
            <Column style={{ paddingRight: '4px' }}>
              <Link href="https://notifications.google.com">
                <Img
                  height="28"
                  src={`${baseUrl}/static/google-play-chat.png`}
                  width="28"
                />
              </Link>
            </Column>
            <Column style={{ paddingRight: '4px' }}>
              <Link href="https://notifications.google.com">
                <Img
                  height="28"
                  src={`${baseUrl}/static/google-play-icon.png`}
                  width="28"
                />
              </Link>
            </Column>
            <Column style={{ paddingRight: '4px' }}>
              <Link href="https://notifications.google.com">
                <Img
                  height="28"
                  src={`${baseUrl}/static/google-play-academy.png`}
                  width="28"
                />
              </Link>
            </Column>
          </Row>
          <Row>
            <Img
              height="48"
              src={`${baseUrl}/static/google-play-footer.png`}
              width="540"
            />
          </Row>
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
    </Body>
  </Html>
);

export default GooglePlayPolicyUpdateEmail;

const main = {
  backgroundColor: '#dbddde',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const sectionLogo = {
  padding: '0 40px',
};

const headerBlue = {
  marginTop: '-1px',
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
  paddingLeft: '20px',
};

const heading = {
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
