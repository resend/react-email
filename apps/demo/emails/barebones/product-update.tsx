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
} from '@react-email/components';
import { barebonesBoxedTailwindConfig } from './theme';
import { BarebonesFonts } from './theme-fonts';

interface ProductUpdateEmailProps {
  companyName?: string;
  url?: string;
}

export const ProductUpdateEmail = ({
  companyName = 'Barebones',
  url = 'https://example.com/',
}: ProductUpdateEmailProps) => (
  <Tailwind config={barebonesBoxedTailwindConfig}>
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>
      <Preview>Product update: what&apos;s new at {companyName}</Preview>
      <Body className="bg-bg-2 m-0 font-sans text-center">
        <Container className="mx-auto mt-8 mobile:mt-0 w-full max-w-[640px]">
          <Section>
            <Section className="bg-bg px-6 mobile:px-2 py-4">
              {/* Header */}
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

              {/* Card 1 */}
              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 pb-5 mobile:pb-4 rounded-[10px]">
                <Section className="mx-auto mb-10 max-w-[422px] text-center">
                  <Text className="mt-0 mb-6 font-13 font-sans text-fg-3">
                    Product update
                  </Text>
                  <Heading
                    as="h1"
                    className="mt-0 mb-6 font-40 font-sans text-fg"
                  >
                    Here&apos;s what&apos;s new with {companyName}
                  </Heading>
                  <Text className="mt-0 mb-6 font-16 font-sans text-fg-2">
                    We shipped a new release with improvements to help you move
                    faster and stay in sync. Open the dashboard to explore the
                    full changelog.
                  </Text>
                  <Section className="text-center">
                    <Button
                      href={url}
                      className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      View in dashboard
                    </Button>
                  </Section>
                </Section>
                <Img
                  src="/static/barebones/barebones-image.png"
                  alt=""
                  width={592}
                  className="block mx-auto rounded-[12px] w-full max-w-[592px]"
                />
              </Section>

              {/* Card 1 // 1 2 3 Steps */}
              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]">
                <Section className="px-6">
                  <Heading
                    as="h2"
                    className="mt-0 mb-10 font-32 font-sans text-fg"
                  >
                    Starting is easy
                  </Heading>
                  <Section className="mb-10">
                    <NumberedStep
                      n="1"
                      title="Review the highlights"
                      body="Skim what's new and jump straight to the features that matter for your team."
                    />
                    <NumberedStep
                      n="2"
                      title="Try it when you're ready"
                      body="Turn on new options on your timeline—no forced migration or downtime for your workflow."
                    />
                    <NumberedStep
                      n="3"
                      title="Share with your team"
                      body="Invite teammates so everyone sees the same improvements and clear next steps."
                      last
                    />
                  </Section>
                  <Section className="text-center">
                    <Button
                      href={url}
                      className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      Explore updates
                    </Button>
                  </Section>
                </Section>
              </Section>

              {/* Card - 2 Columns */}
              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]">
                <Text className="mt-0 mb-16 mobile:mb-10 font-32 font-sans text-fg text-center">
                  Some new things
                </Text>
                <Row className="mb-9">
                  <Column className="mobile:!block pr-2.5 mobile:pr-0 mobile:pb-10 w-1/2 mobile:!w-full mobile:!max-w-full align-top">
                    <Img
                      src="/static/barebones/barebones-image-2.png"
                      alt=""
                      width={288}
                      className="block mx-auto mb-6 rounded-xl w-full max-w-[288px] mobile:!max-w-full"
                    />
                    <Text className="mt-0 mb-1 pl-1 font-16 font-sans text-fg text-left">
                      Quality-of-life fixes
                    </Text>
                    <Text className="m-0 pr-8 mobile:pr-0 pl-1 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
                      Expect faster load times, clearer status, and fewer clicks
                      for everyday tasks. We also tightened the spots where
                      teams tend to get stuck.
                    </Text>
                  </Column>
                  <Column className="mobile:!block pl-2.5 mobile:pl-0 w-1/2 mobile:!w-full mobile:!max-w-full align-top">
                    <Img
                      src="/static/barebones/barebones-image-2.png"
                      alt=""
                      width={288}
                      className="block mx-auto mb-6 rounded-xl w-full max-w-[288px] mobile:!max-w-full"
                    />
                    <Text className="mt-0 mb-1 pl-1 font-16 font-sans text-fg text-base text-left">
                      Under the hood
                    </Text>
                    <Text className="m-0 pr-8 mobile:pr-0 pl-1 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
                      Expect faster load times, clearer status, and fewer clicks
                      for everyday tasks. We also tightened the spots where
                      teams tend to get stuck.
                    </Text>
                  </Column>
                </Row>
                <Section className="text-center">
                  <Button
                    href={url}
                    className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                  >
                    Explore updates
                  </Button>
                </Section>
              </Section>

              {/* Card - Alternating rows */}
              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]">
                <Section className="px-6">
                  <Heading
                    as="h2"
                    className="mt-0 mb-10 font-32 font-sans text-fg"
                  >
                    Some new things
                  </Heading>
                  <Row className="mb-9">
                    <Column className="mobile:!block pr-5 mobile:pr-0 mobile:pb-8 w-[48%] mobile:!w-full mobile:!max-w-full text-left">
                      <Img
                        src="/static/barebones/barebones-image-2.png"
                        alt=""
                        width={311}
                        className="block mx-auto rounded-xl w-full max-w-[311px] mobile:!max-w-full"
                      />
                    </Column>
                    <Column className="mobile:!block mobile:pl-0 w-[52%] mobile:!w-full mobile:!max-w-full text-left">
                      <Text className="mt-0 mb-1 mobile:!max-w-full font-16 font-sans text-fg text-left">
                        Workflow improvements
                      </Text>
                      <Text className="mt-0 mb-3 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
                        Built for teams who need reliability at scale: clearer
                        behavior, better defaults, and less back-and-forth to
                        get work done.
                      </Text>
                      <Link href={url} className="font-16 font-sans text-fg">
                        Learn about Pro
                      </Link>
                    </Column>
                  </Row>
                  <Row className="mb-9">
                    <Column className="mobile:!block pr-5 mobile:pr-0 mobile:pb-8 w-[52%] mobile:!w-full mobile:!max-w-full text-left">
                      <Text className="mt-0 mb-1 mobile:!max-w-full font-16 font-sans text-fg text-base text-left">
                        Reporting & visibility
                      </Text>
                      <Text className="mt-0 mb-3 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
                        Built for teams who need reliability at scale: clearer
                        behavior, better defaults, and less back-and-forth to
                        get work done.
                      </Text>

                      <Link href={url} className="font-16 font-sans text-fg">
                        Learn about Pro
                      </Link>
                    </Column>
                    <Column className="mobile:!block mobile:pl-0 w-[48%] mobile:!w-full mobile:!max-w-full align-middle">
                      <Img
                        src="/static/barebones/barebones-image-2.png"
                        alt=""
                        width={311}
                        className="block mx-auto rounded-xl w-full max-w-[311px] mobile:!max-w-full"
                      />
                    </Column>
                  </Row>
                  <Row>
                    <Column className="mobile:!block pr-5 mobile:pr-0 mobile:pb-8 w-[48%] mobile:!w-full mobile:!max-w-full align-middle">
                      <Img
                        src="/static/barebones/barebones-image-2.png"
                        alt=""
                        width={311}
                        className="block mx-auto rounded-xl w-full max-w-[311px] mobile:!max-w-full"
                      />
                    </Column>
                    <Column className="mobile:!block mobile:pl-0 w-[52%] mobile:!w-full mobile:!max-w-full text-left">
                      <Text className="mt-0 mb-1 mobile:!max-w-full font-16 font-sans text-fg text-left">
                        API & integrations
                      </Text>
                      <Text className="mt-0 mb-3 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
                        Built for teams who need reliability at scale: clearer
                        behavior, better defaults, and less back-and-forth to
                        get work done.
                      </Text>
                      <Link href={url} className="font-16 font-sans text-fg">
                        Learn about Pro
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Section>

              {/* Card — 4 Bullet */}
              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]">
                <Section className="px-6">
                  <Heading
                    as="h2"
                    className="mt-0 mb-10 font-32 font-sans text-fg"
                  >
                    Some new things
                  </Heading>
                  <Section className="mb-10">
                    <Row className="mb-9 text-left">
                      <BulletCell />
                      <BulletCell />
                    </Row>
                    <Row className="mb-3 text-left">
                      <BulletCell />
                      <BulletCell isLast />
                    </Row>
                  </Section>
                  <Section className="text-center">
                    <Button
                      href={url}
                      className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      Explore updates
                    </Button>
                  </Section>
                </Section>
              </Section>

              {/* Card — app download CTAs */}
              <Section className="bg-bg-2 mb-12 px-6 mobile:px-4 py-14 mobile:py-10 rounded-[10px]">
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
                  Get the app.
                  <br />
                  The fastest, easiest way to use {companyName}.
                </Text>
                <Section className="text-center">
                  <Row>
                    <Column className="pr-2 w-1/2 text-right align-middle">
                      <Button
                        href="https://example.com/"
                        className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                      >
                        App Store
                      </Button>
                    </Column>
                    <Column className="pl-2 w-1/2 text-left align-middle">
                      <Button
                        href="https://example.com/"
                        className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                      >
                        Google Play
                      </Button>
                    </Column>
                  </Row>
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

function NumberedStep({
  n,
  title,
  body,
  last,
}: {
  n: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <Row className={last ? undefined : 'mb-9'}>
      <Column className="pr-3 w-10 align-top">
        <Section className="border-stroke-strong py-1 border border-solid rounded-[10px] w-7 text-center">
          <Text className="m-0 font-sans font-normal text-fg text-sm leading-5">
            {n}
          </Text>
        </Section>
      </Column>
      <Column className="pr-8 align-top">
        <Text className="mt-0 mb-1 font-sans font-semibold text-fg text-base text-left">
          {title}
        </Text>
        <Text className="m-0 font-16 font-sans text-fg-2 text-left">
          {body}
        </Text>
      </Column>
    </Row>
  );
}

function BulletCell({ isLast }: { isLast?: boolean }) {
  return (
    <Column
      className={`mobile:!block mobile:!w-full mobile:!max-w-full w-1/2 pr-8 align-top mobile:pr-0${isLast ? '' : 'mobile:mb-8'}`}
    >
      <Text className="mt-0 mb-5">
        <span className="inline-block border-stroke-strong border border-solid rounded-lg size-6 text-[1px] align-middle leading-6">
          &nbsp;
        </span>
      </Text>
      <Text className="m-0 mobile:!max-w-full font-16 font-sans text-fg-2 text-left">
        These updates roll out gradually. Check your workspace to see
        what&apos;s available to you today.
      </Text>
    </Column>
  );
}

export default ProductUpdateEmail;
