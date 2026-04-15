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
} from '@react-email/components';
import { DitherFonts } from './dither-fonts';
import { ditherTailwindConfig } from './theme';

interface SubscriptionConfirmationProps {
  companyName?: string;
  url?: string;
}

export const SubscriptionConfirmation = ({
  companyName = 'Dither',
  url = 'https://example.com/',
}: SubscriptionConfirmationProps) => {
  const planName = 'Pro';
  const userName = 'Alex';
  const nextBillingDate = 'April 22, 2026';
  return (
    <Tailwind config={ditherTailwindConfig}>
      <Html>
        <Head>
          <DitherFonts />
        </Head>
        <Preview>
          You&apos;re on {planName} with {companyName}
        </Preview>
        <Body className="bg-bg-2 font-14 m-0 p-0 font-sans">
          <Container className="bg-bg mx-auto max-w-[640px]">
            {/* Header */}
            <Section className="mobile:px-4 px-6 py-6">
              <Img
                src="/static/shared/logo-white.png"
                alt=""
                width="32"
                height="32"
                className="block"
              />
            </Section>
            <Section className="mobile:px-4 px-6">
              <Img
                src="/static/dither/dither-image-1.png"
                alt=""
                width={592}
                className="block w-full max-w-[592px]"
              />
            </Section>
            <Section
              align="left"
              className="mobile:px-4 mobile:pt-10 mobile:pb-16 px-6 pt-16 pb-24 text-left"
            >
              <Section
                align="left"
                className="mobile:mb-8 mobile:!max-w-full mb-12 max-w-[490px] text-left"
              >
                <Text className="font-56 font-condensed mobile:font-40 text-fg m-0 uppercase">
                  welcome to {planName}
                </Text>
                <Text className="font-14 text-fg-2 m-0 mt-6 font-sans">
                  Thanks for starting your {planName} subscription, {userName}.
                </Text>
                <Text className="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                  Your payment method has been charged. The next charge will be
                  on{' '}
                  <span className="text-fg font-semibold">
                    {nextBillingDate}.
                  </span>
                </Text>
                <Text className="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                  You can modify your payment method or cancel your subscription
                  anytime by visiting the {companyName}{' '}
                  <Link href={url} className="text-fg-2">
                    billing settings
                  </Link>{' '}
                  page.
                </Text>
              </Section>
              <Button
                href={url}
                className="bg-fg font-15 text-bg inline-block px-5 py-3.5 text-center font-sans"
              >
                Open {companyName}
              </Button>
            </Section>

            <Section className="mobile:px-4 mobile:pb-10 px-6 pb-14">
              <Text className="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase">
                Get started
              </Text>

              <Section className="mobile:py-8 border-stroke border-b py-10">
                <Text className="font-20 font-condensed text-fg mb-4">
                  Set up your workspace
                </Text>
                <Text className="font-14 text-fg-2 m-0 my-3 font-sans">
                  Complete the basics to get the most out of your account.
                </Text>
                <Link
                  href="https://example.com/"
                  className="font-15 text-fg font-sans"
                >
                  Complete Setup
                </Link>
              </Section>

              <Section className="mobile:py-8 border-stroke border-b py-10">
                <Text className="font-20 font-condensed text-fg mb-4">
                  Invite your team
                </Text>
                <Text className="font-14 text-fg-2 m-0 my-3 font-sans">
                  Collaboration works best when everyone&apos;s in.
                </Text>
                <Link
                  href="https://example.com/"
                  className="font-15 text-fg font-sans"
                >
                  Invite Teammates
                </Link>
              </Section>

              <Section className="mobile:pt-10 pt-14">
                <Text className="font-15 text-fg m-0 font-sans">
                  Need help?
                </Text>
                <Text className="mobile:!max-w-full font-13 text-fg-2 m-0 mt-0.5 max-w-[490px] font-sans">
                  Find guides, tips, and best practices anytime, visit our{' '}
                  <Link href="https://example.com/" className="text-fg-2">
                    Help Center
                  </Link>
                  .
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mobile:px-4 mobile:pt-12 mobile:pb-12 border-stroke border-t px-6 pt-20 pb-16">
              <Text className="font-13 text-fg-2 m-0 max-w-[320px] font-sans">
                {companyName} helps teams cut through noise—clear priorities,
                fewer tabs, and less busywork from idea to shipped work.
              </Text>
              <Row align="left">
                <Column className="w-full align-top">
                  <Section align="left" className="mt-8 w-[152px]">
                    <Row align="left">
                      <Column className="w-[20px] pr-6">
                        <Link
                          href="https://example.com/"
                          className="inline-block"
                        >
                          <Img
                            src="/static/shared/social-x-white.png"
                            alt="X"
                            width="20"
                            height="20"
                            className="block"
                          />
                        </Link>
                      </Column>
                      <Column className="w-[20px] pr-6">
                        <Link
                          href="https://example.com/"
                          className="inline-block"
                        >
                          <Img
                            src="/static/shared/social-li-white.png"
                            alt="LinkedIn"
                            width="20"
                            height="20"
                            className="block"
                          />
                        </Link>
                      </Column>
                      <Column className="w-[20px] pr-6">
                        <Link
                          href="https://example.com/"
                          className="inline-block"
                        >
                          <Img
                            src="/static/shared/social-yt-white.png"
                            alt="YouTube"
                            width="20"
                            height="20"
                            className="block"
                          />
                        </Link>
                      </Column>
                      <Column className="w-[20px]">
                        <Link
                          href="https://example.com/"
                          className="inline-block"
                        >
                          <Img
                            src="/static/shared/social-gh-white.png"
                            alt="GitHub"
                            width="20"
                            height="20"
                            className="block"
                          />
                        </Link>
                      </Column>
                    </Row>
                  </Section>
                </Column>
              </Row>
              <Row align="left">
                <Column className="w-full pt-8 align-top">
                  <Text className="font-11 text-fg-2 m-0 font-sans">
                    123 Market Street, Floor 1
                    <br />
                    Tech City, CA, 94102
                  </Text>
                </Column>
              </Row>
              <Row align="left">
                <Column className="w-full pt-5 align-top">
                  <Text className="font-11 text-fg-2 m-0 max-w-[160px] font-sans">
                    <Link href="https://example.com/" className="text-fg-2">
                      Unsubscribe
                    </Link>{' '}
                    from {companyName} marketing emails.
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default SubscriptionConfirmation;
