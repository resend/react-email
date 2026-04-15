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
} from 'react-email';
import { CollageFonts } from './collage-fonts';
import { collageTailwindConfig } from './theme';

interface SubscriptionUpdateProps {
  companyName: string;
  url: string;
  userName: string;
  planName: string;
  planPrice: string;
  cycleLabel: string;
  nextBillingDate: string;
}

export const SubscriptionUpdate = ({
  companyName,
  url,
  userName,
  planName,
  planPrice,
  cycleLabel,
  nextBillingDate,
}: SubscriptionUpdateProps) => {
  return (
    <Tailwind config={collageTailwindConfig}>
      <Html>
        <Head>
          <CollageFonts />
        </Head>

        <Body className="bg-canvas font-14 font-inter text-fg m-0 p-0">
          <Preview>
            Your {companyName} plan renewed ({planName})
          </Preview>
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

                <Section className="px-10 pb-14 pt-8">
                  <Section
                    align="left"
                    className="mb-12 ml-0 mr-auto w-full max-w-[480px] text-left"
                  >
                    <Text className="font-48 text-fg m-0 font-sans">
                      Plan renewed
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      Hi {userName}. Your {companyName} subscription renewed for
                      another {cycleLabel}. Here&apos;s a quick summary of your
                      plan and billing.
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      You&apos;re on the {planName} plan at {planPrice} per{' '}
                      {cycleLabel}. Your next charge is on {nextBillingDate}.
                      Review invoices, update payment details, or change plans
                      anytime in your account.
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      Something look off? Reply to this email and we&apos;ll
                      help sort it out.
                    </Text>
                  </Section>

                  <Button
                    href={url}
                    className="bg-brand font-15 font-inter text-fg-inverted inline-block border-none px-5 py-3.5 text-center"
                  >
                    Manage subscription
                  </Button>
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
                        </Link>{' '}
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

SubscriptionUpdate.PreviewProps = {
  companyName: 'Collage',
  url: 'https://example.com/',
  userName: 'Alex',
  planName: 'Pro',
  planPrice: '$29',
  cycleLabel: 'month',
  nextBillingDate: 'April 22, 2026',
} satisfies SubscriptionUpdateProps;

export default SubscriptionUpdate;
