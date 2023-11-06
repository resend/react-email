import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import { Tailwind } from "@react-email/tailwind";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const GooglePlayPolicyUpdateEmailWithTailwind = () => (
  <Tailwind
    config={{
      theme: {
        extend: {
          fontFamily: {
            main: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
          },
        },
      },
    }}
  >
    <Html>
      <Head />
      <Preview>Google Play developers</Preview>
      <Body className="bg-[#dbddde] font-main">
        <Container className="my-7 mx-auto w-[610px] bg-white rounded-md overflow-hidden">
          <Section>
            <Row>
              <Column>
                <Img
                  className="-mt-[1px]"
                  src={`${baseUrl}/static/google-play-header.png`}
                  width="305"
                  height="28"
                  alt="Google Play developers header blue transparent"
                />
                <Img
                  className="py-0 px-10"
                  src={`${baseUrl}/static/google-play-logo.png`}
                  width="155"
                  height="31"
                  alt="Google Play"
                />
              </Column>
            </Row>
          </Section>

          <Section className="py-0 px-10">
            <Hr className="border-[#e8eaed] my-5 mx-0" />
            <Text className="text-sm leading-6 text-[#004dcf]">
              DEVELOPER UPDATE
            </Text>
            <Text className="text-sm leading-5">
              Hello Google Play Developer,
            </Text>
            <Text className="text-sm leading-5">
              We strive to make Google Play a safe and trusted experience for
              users.
            </Text>
            <Text className="text-sm leading-5">
              We've added clarifications to our{" "}
              <Link
                href="https://notifications.google.com"
                className="text-sm leading-5 text-[#004dcf]"
              >
                Target API Level policy
              </Link>
              . Because this is a clarification, our enforcement standards and
              practices for this policy remain the same.
            </Text>
          </Section>
          <Section className="pl-10">
            <Text className="text-sm leading-5">
              We’re noting exceptions to the{" "}
              <Link
                href="https://notifications.google.com"
                className="text-sm leading-5 text-[#004dcf]"
              >
                Target API Level policy
              </Link>
              , which can be found in our updated{" "}
              <Link
                href="https://notifications.google.com"
                className="text-sm leading-5 text-[#004dcf]"
              >
                Help Center article.
              </Link>
              These exceptions include permanently private apps and apps that
              target automotive or wearables form factors and are bundled within
              the same package.{" "}
              <Link
                href="https://notifications.google.com"
                className="text-sm leading-5 text-[#004dcf]"
              >
                Learn more
              </Link>
            </Text>
          </Section>
          <Section className="py-0 px-10">
            <Text className="text-sm leading-5">
              We’re also extending the deadline to give you more time to adjust
              to these changes. Now, apps that target API level 29 or below will
              start experiencing reduced distribution starting{" "}
              <b>Jan 31, 2023</b> instead of Nov 1, 2022. If you need more time
              to update your app, you can request an extension to keep your app
              discoverable to all users until May 1, 2023.
            </Text>
            <Hr className="border-[#e8eaed] my-5 mx-0" />
          </Section>

          <Section className="py-0 px-10">
            <Text className="text-sm leading-5">Thank you,</Text>
            <Text className="text-xl leading-5 text-[#3c4043]">
              The Google Play team
            </Text>
          </Section>

          <Section className="bg-[#f0fcff] w-[90%] rounded-md overflow-hidden pl-5">
            <Row>
              <Text className="text-sm leading-5">Connect with us</Text>
            </Row>
            <Row
              align="left"
              style={{
                width: "84px",
                float: "left",
              }}
            >
              <Column style={{ paddingRight: "4px" }}>
                <Link href="https://notifications.google.com">
                  <Img
                    width="28"
                    height="28"
                    src={`${baseUrl}/static/google-play-chat.png`}
                  />
                </Link>
              </Column>
              <Column style={{ paddingRight: "4px" }}>
                <Link href="https://notifications.google.com">
                  <Img
                    width="28"
                    height="28"
                    src={`${baseUrl}/static/google-play-icon.png`}
                  />
                </Link>
              </Column>
              <Column style={{ paddingRight: "4px" }}>
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
                width="540"
                height="48"
                src={`${baseUrl}/static/google-play-footer.png`}
              />
            </Row>
          </Section>

          <Section className="py-0 px-10 !pt-7">
            <Text className="text-xs leading-5 text-[#3c4043] text-center margin-0">
              © 2022 Google LLC 1600 Amphitheatre Parkway, Mountain View, CA
              94043, USA
            </Text>
            <Text className="text-xs leading-5 text-[#3c4043] text-center margin-0">
              You have received this mandatory email service announcement to
              update you about important changes to your Google Play Developer
              account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default GooglePlayPolicyUpdateEmailWithTailwind;
