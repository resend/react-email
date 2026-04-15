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

interface WelcomeEmailProps {
  companyName: string;
  url: string;
}

export const WelcomeEmail = ({ companyName, url }: WelcomeEmailProps) => (
  <Tailwind config={barebonesBoxedTailwindConfig}>
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>
      <Preview>Welcome aboard—{companyName}</Preview>
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

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 pt-5 mobile:pt-4 pb-14 mobile:pb-10 rounded-[10px]">
                <Section className="mb-10">
                  <Img
                    src="/static/barebones/barebones-image.png"
                    alt=""
                    width={600}
                    className="block mx-auto rounded-[12px] w-full max-w-[600px]"
                  />
                </Section>
                <Section className="mx-auto max-w-[422px] text-center">
                  <Text className="mt-0 mb-6 font-13 font-sans text-fg-3">
                    Thanks for joining us
                  </Text>
                  <Heading
                    as="h1"
                    className="mt-0 mb-6 font-40 font-sans text-fg"
                  >
                    Welcome to {companyName}
                  </Heading>
                  <Text className="m-0 font-16 font-sans text-fg-2">
                    You&apos;re all set. Open your dashboard to explore the
                    basics, connect a few tools, and invite your team when
                    you&apos;re ready.
                  </Text>
                </Section>
              </Section>

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 pt-5 mobile:pt-4 pb-14 mobile:pb-10 rounded-[10px]">
                <Section className="mb-10">
                  <Img
                    src="/static/barebones/barebones-image.png"
                    alt=""
                    width={600}
                    className="block mx-auto rounded-[12px] w-full max-w-[600px]"
                  />
                </Section>
                <Section className="px-6">
                  <Heading
                    as="h2"
                    className="mt-0 mb-10 font-32 font-sans text-fg"
                  >
                    Getting started
                  </Heading>
                  <Section className="mb-10">
                    <Row className="mb-9 text-left">
                      <WelcomeBulletCell />
                      <WelcomeBulletCell />
                    </Row>
                    <Row className="mb-3 text-left">
                      <WelcomeBulletCell />
                      <WelcomeBulletCell isLast />
                    </Row>
                  </Section>
                  <Section className="text-center">
                    <Button
                      href={url}
                      className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      Open dashboard
                    </Button>
                  </Section>
                </Section>
              </Section>

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]">
                <Text className="mt-0 mb-16 mobile:mb-10 font-32 font-sans text-fg text-center">
                  Some new things
                </Text>
                <Row>
                  <Column className="mobile:!block pr-2.5 mobile:pr-0 mobile:pb-10 w-1/2 mobile:!w-full mobile:!max-w-full align-top">
                    <Img
                      src="/static/barebones/barebones-image.png"
                      alt=""
                      width={280}
                      className="block mx-auto mb-6 rounded-xl w-full max-w-[280px] mobile:!max-w-full"
                    />
                    <Text className="mt-0 mb-1 pl-1 font-16 font-sans text-fg text-left">
                      Team workspaces
                    </Text>
                    <Text className="m-0 pr-8 mobile:pr-0 pl-1 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
                      Roles, guests, and access levels so the right people see
                      the right work—without extra admin overhead.
                    </Text>
                  </Column>
                  <Column className="mobile:!block pl-2.5 mobile:pl-0 w-1/2 mobile:!w-full mobile:!max-w-full align-top">
                    <Img
                      src="/static/barebones/barebones-image.png"
                      alt=""
                      width={280}
                      className="block mx-auto mb-6 rounded-xl w-full max-w-[280px] mobile:!max-w-full"
                    />
                    <Text className="mt-0 mb-1 pl-1 font-16 font-sans text-fg text-left">
                      Connect your stack
                    </Text>
                    <Text className="m-0 pr-8 mobile:pr-0 pl-1 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
                      Plug in the apps your team already uses and keep updates
                      flowing without jumping between tabs.
                    </Text>
                  </Column>
                </Row>
                <Section className="mt-9 text-center">
                  <Button
                    href={url}
                    className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                  >
                    Explore features
                  </Button>
                </Section>
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
                <Text className="mt-0 mb-8 font-28 font-sans text-fg-2 text-center">
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

function WelcomeBulletCell({ isLast }: { isLast?: boolean }) {
  return (
    <Column
      className={`mobile:!block mobile:!w-full mobile:!max-w-full w-1/2 pr-8 align-top mobile:pr-0${isLast ? '' : ' mobile:mb-8'}`}
    >
      <Text className="mt-0 mb-5">
        <span className="inline-block border-stroke-strong border border-solid rounded-full size-6 align-middle" />
      </Text>
      <Text className="m-0 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
        Bring your team, tools, and workflows together in one place—with
        permissions that match how you work.
      </Text>
    </Column>
  );
}

WelcomeEmail.PreviewProps = {
  companyName: 'Barebones',
  url: 'https://example.com/',
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
