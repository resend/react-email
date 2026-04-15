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
import { DitherFonts } from './dither-fonts';
import { ditherTailwindConfig } from './theme';

interface FeatureAnnouncementEmailProps {
  companyName: string;
  url: string;
}

export const FeatureAnnouncementEmail = ({
  companyName,
  url,
}: FeatureAnnouncementEmailProps) => {
  const featureName = 'Smart Tasks';
  const heroImageSrc = '/static/dither/dither-image-2.png';

  return (
    <Tailwind config={ditherTailwindConfig}>
      <Html>
        <Head>
          <DitherFonts />
        </Head>
        <Preview>Meet {featureName}</Preview>
        <Body className="bg-bg-2 font-14 m-0 p-0 font-sans">
          <Container className="bg-bg mx-auto max-w-[640px]">
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
                src={heroImageSrc}
                alt=""
                width={592}
                className="mobile:!max-w-full block w-full max-w-[592px]"
              />
            </Section>

            <Section className="mobile:px-4 mobile:pt-10 mobile:pb-8 px-6 pt-14 pb-12">
              <Text className="mobile:!max-w-full font-56 font-condensed mobile:font-40 text-fg m-0 max-w-[490px] uppercase">
                Meet a new way to manage work
              </Text>
              <Text className="mobile:!max-w-full font-14 text-fg-2 m-0 mt-10 max-w-[490px] font-sans">
                Introducing {featureName}: a calmer way to organize work,
                surface what matters next, and keep your team aligned without
                the noise.
              </Text>
              <Section className="mt-10">
                <Button
                  href={url}
                  className="bg-fg font-15 text-bg inline-block px-5 py-3.5 text-center font-sans"
                >
                  Explore {featureName}
                </Button>
              </Section>
            </Section>

            <Section className="mobile:px-4 mobile:pt-8 mobile:pb-12 px-6 pt-10 pb-16">
              <Text className="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase">
                Meet smart tasks
              </Text>
              <Section className="pt-12">
                <Img
                  src={heroImageSrc}
                  alt=""
                  width={592}
                  className="mobile:!max-w-full block w-full max-w-[592px]"
                />
                <Text className="font-20 font-condensed text-fg m-0 mt-8">
                  Auto-prioritization
                </Text>
                <Text className="font-14 text-fg-2 m-0 my-3 font-sans">
                  All your tasks for the week are surfaced based on urgency and
                  impact.
                </Text>
                <Link href={url} className="font-15 text-fg font-sans">
                  Explore {featureName}
                </Link>
              </Section>

              {['Less manual work', 'Clear focus', 'Better alignment'].map(
                (title, idx) => (
                  <Section
                    key={title}
                    className={
                      idx === 0 ? 'mobile:pt-10 pt-16' : 'mobile:pt-8 pt-12'
                    }
                  >
                    <Row className="align-top">
                      <Column className="mobile:!block mobile:pb-6 mobile:!w-full mobile:!max-w-full w-[48%] align-top">
                        <Img
                          src={heroImageSrc}
                          alt=""
                          width={269}
                          className="mobile:!max-w-full block w-full max-w-[269px]"
                        />
                      </Column>
                      <Column className="mobile:!block mobile:pl-0 mobile:!w-full mobile:!max-w-full w-[52%] pl-6 align-middle">
                        <Text className="font-20 font-condensed text-fg m-0">
                          {title}
                        </Text>
                        <Text className="font-14 text-fg-2 m-0 mt-3 font-sans">
                          {idx === 0
                            ? 'Fewer status updates, more automated work.'
                            : idx === 1
                              ? 'Always know what to do next—less thrash, more momentum.'
                              : 'Your team stays in sync automatically.'}
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                ),
              )}

              <Text className="mobile:!max-w-full font-20 m-0 mt-12 max-w-[456px]">
                <span className="text-fg">
                  Smart Tasks analyzes your projects in real time and helps
                  organize{' '}
                </span>
                <span className="text-fg-3">
                  your workload automatically. As things change, your task list
                  updates so you&apos;re always focused on what matters most.
                </span>
              </Text>

              <Section align="left" className="pt-12">
                <Img
                  src={heroImageSrc}
                  alt=""
                  width={592}
                  className="mobile:!max-w-full mx-auto block w-full max-w-[592px]"
                />
                <Section
                  align="left"
                  className="bg-bg mobile:px-6 mobile:py-12 border-stroke mx-auto mt-6 max-w-[640px] border px-10 py-20 text-center"
                >
                  <Text className="font-14 text-fg m-0 font-sans">
                    &quot;Smart Tasks helps me know what to do next without
                    thinking about it.&quot;
                  </Text>
                  <Text className="font-13 text-fg-2 m-0 mt-4 font-sans">
                    Alex, Product Designer at Studio
                  </Text>
                </Section>
              </Section>

              <Section className="mobile:pt-12 pt-18">
                <Text className="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase">
                  Try smart tasks
                </Text>
                <Text className="font-14 text-fg-2 m-0 mt-5 font-sans">
                  See how much easier work can be.
                </Text>
                <Section className="mt-8">
                  <Button
                    href={url}
                    className="bg-fg font-15 text-bg inline-block px-5 py-3.5 text-center font-sans"
                  >
                    Explore {featureName}
                  </Button>
                </Section>
              </Section>

              <Section className="mobile:pt-10 pt-14">
                <Text className="font-13 text-fg m-0 font-sans">
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
            <Section className="mobile:px-4 mobile:py-12 border-stroke border-t px-6 py-16">
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

FeatureAnnouncementEmail.PreviewProps = {
  companyName: 'Dither',
  url: 'https://example.com/',
} satisfies FeatureAnnouncementEmailProps;

export default FeatureAnnouncementEmail;
