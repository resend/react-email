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
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const GooglePlayPolicyUpdateEmail = () => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-[#dbddde] font-google">
        <Preview>Google Play developers</Preview>
        <Container className="my-[30px] mx-auto bg-white rounded-[5px] overflow-hidden">
          <Section>
            <Row>
              <Column>
                <Img
                  className="-mt-px"
                  src={`${baseUrl}/static/google-play-header.png`}
                  width="305"
                  height="28"
                  alt="Google Play developers header blue transparent"
                />
                <Img
                  className="px-10"
                  src={`${baseUrl}/static/google-play-logo.png`}
                  width="155"
                  height="31"
                  alt="Google Play"
                />
              </Column>
            </Row>
          </Section>

          <Section className="px-10">
            <Hr className="border-[#e8eaed] my-5" />
            <Text className="text-sm leading-[26px] font-bold text-[#004dcf]">
              DEVELOPER UPDATE
            </Text>
            <Text className="text-sm leading-[22px] text-[#3c4043]">
              Hello Google Play Developer,
            </Text>
            <Text className="text-sm leading-[22px] text-[#3c4043]">
              We strive to make Google Play a safe and trusted experience for
              users.
            </Text>
            <Text className="text-sm leading-[22px] text-[#3c4043]">
              We've added clarifications to our{' '}
              <Link
                href="https://notifications.google.com"
                className="text-sm leading-[22px] text-[#004dcf]"
              >
                Target API Level policy
              </Link>
              . Because this is a clarification, our enforcement standards and
              practices for this policy remain the same.
            </Text>
          </Section>
          <Section className="pl-10">
            <Text className="text-sm leading-[22px] text-[#3c4043]">
              We're noting exceptions to the{' '}
              <Link
                href="https://notifications.google.com"
                className="text-sm leading-[22px] text-[#004dcf]"
              >
                Target API Level policy
              </Link>
              , which can be found in our updated{' '}
              <Link
                href="https://notifications.google.com"
                className="text-sm leading-[22px] text-[#004dcf]"
              >
                Help Center article.
              </Link>
              These exceptions include permanently private apps and apps that
              target automotive or wearables form factors and are bundled within
              the same package.{' '}
              <Link
                href="https://notifications.google.com"
                className="text-sm leading-[22px] text-[#004dcf]"
              >
                Learn more
              </Link>
            </Text>
          </Section>
          <Section className="px-10">
            <Text className="text-sm leading-[22px] text-[#3c4043]">
              We're also extending the deadline to give you more time to adjust
              to these changes. Now, apps that target API level 29 or below will
              start experiencing reduced distribution starting{' '}
              <b>Jan 31, 2023</b> instead of Nov 1, 2022. If you need more time
              to update your app, you can request an extension to keep your app
              discoverable to all users until May 1, 2023.
            </Text>
            <Hr className="border-[#e8eaed] my-5" />
          </Section>

          <Section className="px-10">
            <Text className="text-sm leading-[22px] text-[#3c4043]">
              Thank you,
            </Text>
            <Text className="text-xl leading-[22px] text-[#3c4043]">
              The Google Play team
            </Text>
          </Section>

          <Section className="bg-[#f0fcff] w-[90%] rounded-[5px] overflow-hidden pl-5">
            <Row>
              <Text className="text-sm leading-[22px] text-[#3c4043]">
                Connect with us
              </Text>
            </Row>
            <Row align="left" className="w-[84px] float-left">
              <Column className="pr-1">
                <Link href="https://notifications.google.com">
                  <Img
                    width="28"
                    height="28"
                    src={`${baseUrl}/static/google-play-chat.png`}
                  />
                </Link>
              </Column>
              <Column className="pr-1">
                <Link href="https://notifications.google.com">
                  <Img
                    width="28"
                    height="28"
                    src={`${baseUrl}/static/google-play-icon.png`}
                  />
                </Link>
              </Column>
              <Column className="pr-1">
                <Link href="https://notifications.google.com">
                  <Img
                    width="28"
                    height="28"
                    src={`${baseUrl}/static/google-play-academy.png`}
                  />
                </Link>
              </Column>
            </Row>
            <Row>
              <Img
                className="max-w-full"
                width="540"
                height="48"
                src={`${baseUrl}/static/google-play-footer.png`}
              />
            </Row>
          </Section>

          <Section className="px-10 pb-[30px]">
            <Text className="text-xs leading-[22px] text-[#3c4043] text-center m-0">
              © 2022 Google LLC 1600 Amphitheatre Parkway, Mountain View, CA
              94043, USA
            </Text>
            <Text className="text-xs leading-[22px] text-[#3c4043] text-center m-0">
              You have received this mandatory email service announcement to
              update you about important changes to your Google Play Developer
              account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default GooglePlayPolicyUpdateEmail;

const sectionLogo = {
  padding: '0 40px',
};

const headerBlue = {
  marginTop: '-1px',
};

const container = {
  margin: '30px auto',
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

const footer = {
  maxWidth: '100%',
};
