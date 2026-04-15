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

interface FeatureAnnouncementEmailProps {
  companyName: string;
  url: string;
}

export const FeatureAnnouncementEmail = ({
  companyName,
  url,
}: FeatureAnnouncementEmailProps) => (
  <Tailwind config={barebonesBoxedTailwindConfig}>
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>
      <Preview>Release notes — {companyName}</Preview>
      <Body className="bg-bg-2 m-0 font-sans text-center">
        <Container className="mx-auto mt-8 mobile:mt-0 w-full max-w-[640px]">
          <Section>
            <Section className="bg-bg px-6 mobile:px-2 py-4">
              <Section className="mb-3 px-6">
                <Row>
                  <Column className="py-[7px] w-1/2 align-middle">
                    <Row>
                      <Column className="w-[32px] align-middle">
                        <Img
                          src="/static/shared/logo-black.png"
                          alt=""
                          width={23}
                          className="block"
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column align="right" className="py-[7px] w-1/2 align-middle">
                    <Text className="m-0 font-13 font-sans text-right">
                      <span className="text-fg-3">{companyName}</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-6 mobile:px-4 py-20 mobile:py-12 pb-16 mobile:pb-10 rounded-[10px]">
                <Section className="mx-auto mb-16 max-w-[422px] text-center">
                  <Text className="mt-0 mb-4 font-13 font-sans text-fg-3">
                    The new from {companyName}
                  </Text>
                  <Heading
                    as="h1"
                    className="mt-0 mb-4 font-40 font-sans text-fg"
                  >
                    Release Notes
                  </Heading>
                  <Text className="m-0 font-16 font-sans text-fg-2">
                    Learn what&apos;s shipping this month, plus other{' '}
                    {companyName} updates below.
                  </Text>
                </Section>

                <Section className="mb-20">
                  <FeatureBlock
                    imageUrl="/static/barebones/barebones-image.png"
                    ctaUrl={url}
                    title="Hello feature. Goodbye old feature."
                    bodyP1="Ship updates in smaller, safer steps: clearer defaults, fewer clicks, and less context switching for your team."
                  />
                </Section>
                <FeatureBlock
                  imageUrl="/static/barebones/barebones-image.png"
                  ctaUrl={url}
                  title="Hello feature. Goodbye old feature."
                  bodyP1="Ship updates in smaller, safer steps: clearer defaults, fewer clicks, and less context switching for your team."
                />
              </Section>

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-8 mobile:px-4 py-14 mobile:py-10 rounded-[10px] text-left">
                <Heading
                  as="h2"
                  className="mt-0 mb-10 font-32 font-sans text-fg text-left"
                >
                  New ways to work
                </Heading>
                <Row align="left" className="mb-9">
                  <Column className="pr-8 mobile:pr-5 w-14 align-top">
                    <Img
                      src="/static/barebones/barebones-image-3.png"
                      alt=""
                      width={48}
                      className="block"
                    />
                  </Column>
                  <Column className="w-full text-left align-top">
                    <Text className="mt-0 mb-1.5 font-16 font-sans text-fg">
                      Automations that save real time
                    </Text>
                    <Text className="mt-0 mb-4 max-w-[400px] font-16 font-sans text-fg-2">
                      Bring your workflows into one place, cut manual handoffs,
                      and give everyone the same source of truth.
                    </Text>
                    <Link
                      href="https://example.com/"
                      className="font-16 font-sans text-fg"
                    >
                      Read more
                    </Link>
                  </Column>
                </Row>
                <Row align="left">
                  <Column className="pr-8 mobile:pr-5 w-14 align-top">
                    <Img
                      src="/static/barebones/barebones-image-3.png"
                      alt=""
                      width={48}
                      className="block"
                    />
                  </Column>
                  <Column className="w-full max-w-[440px] text-left align-top">
                    <Text className="mt-0 mb-1.5 font-16 font-sans text-fg">
                      A clearer view of what needs attention
                    </Text>
                    <Text className="mt-0 mb-4 max-w-[400px] font-16 font-sans text-fg-2">
                      Bring your workflows into one place, cut manual handoffs,
                      and give everyone the same source of truth.
                    </Text>
                    <Link
                      href="https://example.com/"
                      className="font-16 font-sans text-fg"
                    >
                      Read more
                    </Link>
                  </Column>
                </Row>
              </Section>

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-6 mobile:px-4 pt-8 mobile:pt-6 pb-16 mobile:pb-10 rounded-[10px]">
                <FeatureBlock
                  imageUrl="/static/barebones/barebones-image.png"
                  ctaUrl={url}
                  title="Hello feature. Goodbye old feature."
                  bodyP1="Ship updates in smaller, safer steps: clearer defaults, fewer clicks, and less context switching for your team."
                />
              </Section>

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-6 mobile:px-4 py-14 mobile:py-10 rounded-[10px]">
                <Section className="mb-8 text-center">
                  <Section className="bg-black mx-auto p-3 rounded-xl w-14 text-center">
                    <Img
                      src="/static/shared/logo-white.png"
                      alt=""
                      width={32}
                      className="block mx-auto"
                    />
                  </Section>
                </Section>
                <Text className="mx-auto mt-0 mb-8 max-w-[420px] font-28 font-sans text-fg text-center">
                  Start using {companyName}
                  <br />
                  The fastest, easiest way to use {companyName}.
                </Text>
                <Section className="text-center">
                  <Button
                    href={url}
                    className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                  >
                    Go to Dashboard
                  </Button>
                </Section>
              </Section>

              {/* Footer */}
              <Section className="bg-bg">
                <Row>
                  <Column className="px-6 py-10 text-center">
                    <Text className="mx-auto mt-0 mb-8 max-w-[280px] font-13 font-sans text-fg-3 text-center">
                      {companyName} is the catchy slogan that perfectly
                      encapsulates the vision of our company.
                    </Text>

                    <Section className="mb-8">
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src="/static/shared/social-x-black.png"
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
                          src="/static/shared/social-in-black.png"
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
                          src="/static/shared/social-yt-black.png"
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
                          src="/static/shared/social-gh-black.png"
                          alt="GitHub"
                          width={18}
                          className="block"
                        />
                      </Link>
                    </Section>

                    <Text className="mt-4 mb-5 font-11 font-sans text-fg-3 text-center">
                      123 Market Street, Floor 1
                      <br />
                      Tech City, CA, 94102
                    </Text>
                    <Text className="m-0 font-11 font-sans text-fg-3 text-center">
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

function FeatureBlock({
  imageUrl,
  ctaUrl,
  title,
  bodyP1,
}: {
  imageUrl: string;
  ctaUrl: string;
  title: string;
  bodyP1: string;
}) {
  return (
    <Section className="text-left">
      <Img
        src={imageUrl}
        alt=""
        width={592}
        className="block mx-auto mb-6 rounded-[12px] w-full max-w-[592px]"
      />
      <Section className="px-2">
        <Text className="font-24 text-fg">{title}</Text>
        <Text className="mb-8 max-w-[420px] font-16 text-fg-2">{bodyP1}</Text>
        <Button
          href={ctaUrl}
          className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
        >
          Try it out
        </Button>
      </Section>
    </Section>
  );
}

FeatureAnnouncementEmail.PreviewProps = {
  companyName: 'Barebones',
  url: 'https://example.com/',
} satisfies FeatureAnnouncementEmailProps;

export default FeatureAnnouncementEmail;
