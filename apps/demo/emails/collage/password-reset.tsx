import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { CollageFonts } from "./collage-fonts";
import { collageTailwindConfig } from "./theme";

interface PasswordResetEmailProps {
  companyName?: string;
  url?: string;
}

export const PasswordResetEmail = ({
  companyName = "Collage",
  url = "https://example.com/",
}: PasswordResetEmailProps) => (
  <Tailwind config={collageTailwindConfig}>
    <Html>
      <Head>
        <CollageFonts />
      </Head>
      <Preview>Reset your password</Preview>
      <Body className="bg-canvas font-14 font-inter text-fg m-0 p-0">
        <Container className="mx-auto max-w-[640px] px-4 pt-16 pb-6">
          <Section className="rounded-[8px] shadow-collage-card">
            <Section className="bg-bg border-stroke rounded-[8px] border">
              <Section className="px-10 pt-16">
                <Img
                  src="/static/collage/collage-image-2.png"
                  alt=""
                  width={148}
                  height={111}
                  className="block border-none"
                />
              </Section>

              <Section className="px-10 pt-8">
                <Section className="mb-9">
                  <Text className="font-48 text-fg m-0 font-sans">
                    Reset your password
                  </Text>
                  <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                    Someone requested a password reset for your {companyName}{" "}
                    account. Use the button below to choose a new password.
                  </Text>
                </Section>

                <Button
                  href={url}
                  className="bg-brand font-15 font-inter text-fg-inverted inline-block border-none px-5 py-3.5 text-center"
                >
                  Change password
                </Button>
              </Section>

              <Section className="px-10 pt-16 pb-8">
                <Text className="font-11 font-inter text-fg-3 m-0 max-w-[310px]">
                  If you didn&apos;t request this, please ignore this email.
                  Your password won&apos;t change until you access the link
                  above and create a new one.
                </Text>
              </Section>

              <Section className="border-stroke border-t px-10 py-16">
                <Text className="font-13 font-inter text-fg-3 m-0 max-w-[320px]">
                  Collage is the workspace where your team keeps projects,
                  context, and updates together—from first idea to launch.
                </Text>

                <Row align="left">
                  <Column className="w-full align-top">
                    <Section align="left" className="mt-8 w-[152px]">
                      <Row align="left">
                        <Column className="w-[20px] pr-8">
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
                            <Img
                              src="/static/shared/social-x-black.png"
                              alt="X"
                              width={20}
                              height={20}
                              className="block border-none"
                            />
                          </Link>
                        </Column>
                        <Column className="w-[20px] pr-8">
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
                            <Img
                              src="/static/shared/social-in-black.png"
                              alt="LinkedIn"
                              width={20}
                              height={20}
                              className="block border-none"
                            />
                          </Link>
                        </Column>
                        <Column className="w-[20px] pr-8">
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
                            <Img
                              src="/static/shared/social-yt-black.png"
                              alt="YouTube"
                              width={20}
                              height={20}
                              className="block border-none"
                            />
                          </Link>
                        </Column>
                        <Column className="w-[20px]">
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
                            <Img
                              src="/static/shared/social-gh-black.png"
                              alt="GitHub"
                              width={20}
                              height={20}
                              className="block border-none"
                            />
                          </Link>
                        </Column>
                      </Row>
                    </Section>
                  </Column>
                </Row>

                <Row align="left">
                  <Column className="w-full pt-8 align-top">
                    <Text className="font-11 font-inter text-fg-2 m-0">
                      123 Market Street, Floor 1
                      <br />
                      Tech City, CA, 94102
                    </Text>
                  </Column>
                </Row>

                <Row align="left">
                  <Column className="w-full pt-5 align-top">
                    <Text className="font-11 font-inter text-fg-2 m-0 max-w-[169px]">
                      <Link href="https://example.com/" className="text-fg-2">
                        Unsubscribe
                      </Link>{" "}
                      from {companyName} marketing emails.
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default PasswordResetEmail;
