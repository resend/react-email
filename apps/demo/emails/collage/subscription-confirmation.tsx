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

interface SubscriptionConfirmationProps {
  companyName?: string;
  url?: string;
}

export const SubscriptionConfirmation = ({
  companyName = 'Collage',
  url = 'https://example.com/',
}: SubscriptionConfirmationProps) => {
  const userName = 'Alex';
  const planName = 'Pro';
  const planPrice = '$29';
  const cycleLabel = 'month';
  const nextBillingDate = 'April 22, 2026';
  const subtotal = '$29.00';
  const tax = '$0.00';
  const total = '$29.00';

  return (
    <Tailwind config={collageTailwindConfig}>
      <Html>
        <Head>
          <CollageFonts />
        </Head>
        <Preview>
          You&apos;re subscribed to {companyName} {planName}
        </Preview>
        <Body className="bg-canvas font-14 text-fg m-0 p-0 font-sans">
          <Container className="mx-auto max-w-[640px] px-4 pt-16 pb-6">
            <Section className="shadow-collage-card rounded-[8px]">
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

                {/* Content */}
                <Section className="px-10 pt-8 pb-14">
                  <Section
                    align="left"
                    className="mb-12 w-full max-w-[480px] text-left"
                  >
                    <Text className="font-48 text-fg m-0 font-sans">
                      Subscription confirmed
                    </Text>
                    <Text className="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                      Hi {userName}, thanks for subscribing to the {planName}{' '}
                      plan with {companyName}. Your subscription is active and
                      you have access to everything included in your plan.
                    </Text>
                    <Text className="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                      You&apos;re billed {planPrice} per {cycleLabel}. Your next
                      charge is on {nextBillingDate}. You can update payment
                      details or cancel anytime from your account.
                    </Text>
                    <Text className="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                      Questions about billing or your plan? Reply to this email
                      and we&apos;re happy to help.
                    </Text>
                  </Section>

                  {/* Table */}
                  <Section className="mb-10">
                    <Section className="mb-[3px] bg-[#EDF0E9] p-3">
                      <Row>
                        <Column>
                          <Text className="font-14 text-fg m-0 font-sans font-normal">
                            Subtotal
                          </Text>
                        </Column>
                        <Column align="right">
                          <Text className="font-14 text-fg m-0 font-sans font-normal">
                            {subtotal}
                          </Text>
                        </Column>
                      </Row>
                    </Section>
                    <Section className="mb-[3px] bg-[#EDF0E9] p-3">
                      <Row>
                        <Column>
                          <Text className="font-14 text-fg m-0 font-sans font-normal">
                            Tax
                          </Text>
                        </Column>
                        <Column align="right">
                          <Text className="font-14 text-fg m-0 font-sans font-normal">
                            {tax}
                          </Text>
                        </Column>
                      </Row>
                    </Section>
                    <Section className="bg-[#D3D9CB] p-3">
                      <Row>
                        <Column>
                          <Text className="font-14 text-fg m-0 font-sans font-normal">
                            Total
                          </Text>
                        </Column>
                        <Column align="right">
                          <Text className="font-14 text-fg m-0 font-sans font-normal">
                            {total}
                          </Text>
                        </Column>
                      </Row>
                    </Section>
                  </Section>

                  <Button
                    href={url}
                    className="bg-brand font-15 text-fg-inverted inline-block border-none px-5 py-3.5 text-center font-sans"
                  >
                    Manage subscription
                  </Button>

                  {/* Get started */}
                  <Section align="left" className="max-w-[490px] pt-16">
                    <Text className="font-32 text-fg m-0 font-sans font-normal">
                      Get started
                    </Text>

                    <Section className="border-stroke mt-2 border-b py-10">
                      <Text className="font-20 text-fg m-0 font-sans font-medium">
                        Set up your workspace
                      </Text>
                      <Text className="font-14 text-fg-2 mx-0 my-3 font-sans">
                        Complete the basics to get the most out of your account.
                      </Text>
                      <Link
                        href="https://example.com/"
                        className="font-15 text-fg font-sans font-medium"
                      >
                        Complete Setup
                      </Link>
                    </Section>

                    <Section className="border-stroke border-b py-10">
                      <Text className="font-20 text-fg m-0 font-sans font-medium">
                        Invite your team
                      </Text>
                      <Text className="font-14 text-fg-2 mx-0 my-3 font-sans">
                        Collaboration works best when everyone&apos;s in.
                      </Text>
                      <Link
                        href="https://example.com/"
                        className="font-15 text-fg font-sans font-medium"
                      >
                        Invite Teammates
                      </Link>
                    </Section>

                    <Section className="pt-14">
                      <Text className="font-15 text-fg m-0 font-sans">
                        Need help?
                      </Text>
                      <Text className="font-14 text-fg-2 m-0 mt-0.5 font-sans">
                        Find guides, tips, and best practices anytime, visit our{' '}
                        <Link href="https://example.com/" className="text-fg-2">
                          Help Center
                        </Link>
                        .
                      </Text>
                    </Section>
                  </Section>
                </Section>

                <Section className="border-stroke border-t px-10 py-16">
                  <Text className="font-13 text-fg-3 m-0 max-w-[320px] font-sans">
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
                      <Text className="font-11 text-fg-2 m-0 max-w-[169px] font-sans">
                        123 Market Street, Floor 1
                        <br />
                        Tech City, CA, 94102
                      </Text>
                    </Column>
                  </Row>

                  <Row align="left">
                    <Column className="w-full pt-5 align-top">
                      <Text className="font-11 text-fg-2 m-0 max-w-[169px] font-sans">
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

export default SubscriptionConfirmation;
