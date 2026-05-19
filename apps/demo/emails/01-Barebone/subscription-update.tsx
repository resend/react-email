// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import { barebonesBoxedTailwindConfig } from './theme';
import { BarebonesFonts } from './theme-fonts';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

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
    <Tailwind config={barebonesBoxedTailwindConfig}>
      <Html>
        <Head>
          <BarebonesFonts />
        </Head>

        <Body className="bg-bg-2 m-0 text-center font-sans">
          <Preview>
            Your {companyName} {planName} subscription was updated
          </Preview>
          <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
            <Section>
              <Section className="bg-bg mobile:px-2 px-6 py-4">
                <Section className="mb-3 px-6">
                  <Row>
                    <Column className="w-1/2 py-[7px] align-middle">
                      <Row>
                        <Column className="w-[32px] align-middle">
                          <Img
                            src={`${baseUrl}/static/shared/logo-black.png`}
                            alt=""
                            width={23}
                            className="block"
                          />
                        </Column>
                      </Row>
                    </Column>
                    <Column
                      align="right"
                      className="w-1/2 py-[7px] align-middle"
                    >
                      <Text className="font-13 m-0 text-right font-sans">
                        <span className="text-fg-3">{companyName}</span>
                      </Text>
                    </Column>
                  </Row>
                </Section>

                <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[64px] text-center">
                  <Section className="mb-3">
                    <Img
                      src={`${baseUrl}/static/shared/logo-black.png`}
                      alt="Logo"
                      width={48}
                      className="mx-auto mb-5 block"
                    />
                    <Heading as="h1" className="font-28 text-fg m-0 font-sans">
                      Your plan was updated
                    </Heading>
                  </Section>

                  <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-[380px] text-center font-sans">
                    Hi {userName},
                    <br />
                    <br />
                    Your {companyName} subscription has been updated.
                    Here&apos;s a summary of your current plan and billing.
                  </Text>

                  <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-[380px] text-center font-sans">
                    You&apos;re on {companyName} {planName} at {planPrice} per{' '}
                    {cycleLabel}. Your next charge is on {nextBillingDate}. You
                    can review invoices, update payment details, or change your
                    plan from your account settings.
                  </Text>

                  <Section className="mb-6 text-center">
                    <Button
                      href={url}
                      className="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
                    >
                      Manage subscription
                    </Button>
                  </Section>

                  <Text className="font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-[400px] text-center font-sans">
                    Something look off?
                    <br />
                    Reply to this email and we&apos;ll help sort it out.
                  </Text>
                </Section>

                {/* Footer */}
                <Section className="bg-bg">
                  <Row>
                    <Column className="px-6 py-10 text-center">
                      <Text className="font-13 text-fg-3 mx-auto mt-0 mb-8 max-w-[280px] text-center font-sans">
                        Barebones is the catchy slogan that perfectly
                        encapsulates the vision of our company.
                      </Text>

                      <Section className="mb-8">
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-x-black.png`}
                            alt="X"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-in-black.png`}
                            alt="LinkedIn"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-yt-black.png`}
                            alt="YouTube"
                            width={18}
                            className="block"
                          />
                        </Link>
                        <Link
                          href="https://example.com/"
                          className="inline-block px-2 align-middle"
                        >
                          <Img
                            src={`${baseUrl}/static/shared/social-gh-black.png`}
                            alt="GitHub"
                            width={18}
                            className="block"
                          />
                        </Link>
                      </Section>

                      <Text className="font-11 text-fg-3 mt-4 mb-5 text-center font-sans">
                        123 Market Street, Floor 1
                        <br />
                        Tech City, CA, 94102
                      </Text>
                      <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                        <Link href="https://example.com/" className="text-fg-3">
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
  companyName: 'Barebones',
  url: 'https://example.com/',
  userName: 'Alex',
  planName: 'Pro',
  planPrice: '$29',
  cycleLabel: 'month',
  nextBillingDate: 'April 22, 2026',
} satisfies SubscriptionUpdateProps;

export default SubscriptionUpdate;
