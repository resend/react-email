import {
  Body,
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

interface TextOnlyEmailProps {
  companyName?: string;
  url?: string;
}

export const TextOnlyEmail = ({
  companyName = "Collage",
  url = "https://example.com/",
}: TextOnlyEmailProps) => {
  return (
    <Tailwind config={collageTailwindConfig}>
      <Html>
        <Head>
          <title>A note from {companyName}</title>
          <CollageFonts />
        </Head>
        <Preview>A short note from the {companyName} team</Preview>
        <Body className="bg-canvas font-14 font-inter text-fg m-0 p-0">
          <Container className="mx-auto max-w-[640px] px-4 pt-16 pb-6">
            <Section className="rounded-[8px] shadow-collage-card">
              <Section className="bg-bg border-stroke rounded-[8px] border">
                <Section className="px-10 pb-14 pt-16">
                  <Text className="font-48 text-fg m-0 font-sans">
                    A note from us
                  </Text>
                  <Section
                    align="left"
                    className="mt-[18px] w-full max-w-[480px] text-left"
                  >
                    <Text className="font-14 font-inter text-fg-2 m-0">
                      We don&apos;t send long emails often—when we do, we want
                      them to feel direct. No hero image, no noise: just a quick
                      word from the team behind {companyName}.
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      We&apos;re building {companyName} so your team can keep
                      projects, context, and updates in one place. If
                      you&apos;ve been in the product lately, thank you—what we
                      hear from you shapes what we ship next.
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      Here&apos;s to fewer tabs and clearer handoffs. When
                      you&apos;re ready to dive back in, we&apos;ll be there.
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      — The {companyName} team
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      <Link href={url} className="text-fg">
                        Open your workspace
                      </Link>
                    </Text>
                  </Section>
                </Section>

                <Section className="border-stroke border-t px-10 py-16">
                  <Text className="font-13 font-inter text-fg-3 m-0 max-w-[320px]">
                    {companyName} is the workspace where your team keeps
                    projects, context, and updates together—from first idea to
                    launch.
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
};

export default TextOnlyEmail;
