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

type WelcomeTip = {
  title: string;
  description: string;
};

interface WelcomeEmailProps {
  companyName?: string;
  url?: string;
}

export const WelcomeEmail = ({
  companyName = 'Collage',
  url = 'https://example.com/',
}: WelcomeEmailProps) => {
  const brand = companyName;
  const welcomeTitle = `Welcome to ${brand}`;

  const tips: WelcomeTip[] = [
    {
      title: 'Complete your profile',
      description:
        'Add a photo and a short bio so teammates recognize you in comments and mentions.',
    },
    {
      title: 'Turn on notifications',
      description:
        'Choose email or in-app alerts so you never miss a review request or deadline.',
    },
    {
      title: 'Browse templates',
      description:
        'Starter layouts and snippets help your team ship polished work without reinventing the wheel.',
    },
  ];

  return (
    <Tailwind config={collageTailwindConfig}>
      <Html>
        <Head>
          <CollageFonts />
        </Head>
        <Preview>Welcome to {brand}</Preview>
        <Body className="bg-canvas font-14 font-inter text-fg m-0 p-0">
          <Container className="mx-auto max-w-[640px] px-4 pt-16 pb-6">
            <Section className="shadow-collage-card rounded-[8px]">
              <Section className="bg-bg border-stroke rounded-[8px] border">
                <Section className="p-0">
                  <Img
                    src="/static/collage/collage-image-5.png"
                    alt=""
                    width={608}
                    className="block w-full max-w-[608px] border-none"
                  />
                </Section>

                <Section className="px-10 pt-20 pb-14 text-left">
                  <Section className="mb-9 text-left">
                    <Text className="font-48 text-fg m-0 font-sans">
                      {welcomeTitle}
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                      Thank you for signing up for {brand}.
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0">
                      You&apos;re all set—explore what&apos;s new and get your
                      first project going.
                    </Text>
                  </Section>

                  <Section className="text-left">
                    <Button
                      href={url}
                      className="bg-brand font-15 font-inter text-fg-inverted inline-block border-none px-5 py-3.5 text-center"
                    >
                      Explore
                    </Button>
                  </Section>
                </Section>

                <Section className="bg-bg-2 px-6 py-20">
                  <Section className="px-6">
                    <Text className="font-48 text-fg m-0 max-w-[400px] font-sans">
                      Your first week in {brand}
                    </Text>
                    <Text className="font-14 font-inter text-fg-2 m-0 mt-[18px] max-w-[479px]">
                      Small steps add up. Use this short checklist to get
                      comfortable—everything here is optional, but it helps you
                      feel at home faster.
                    </Text>
                  </Section>
                  <Section className="px-6 pt-14">
                    <Text className="font-15 font-inter text-fg m-0">
                      Here&apos;s what to try first:
                    </Text>
                    <Section className="pt-9">
                      {tips.map((item, idx) => (
                        <Section
                          key={idx}
                          className="border-stroke border-b py-6"
                        >
                          <Row>
                            <Column className="w-[92%] align-top">
                              <Text className="font-20 font-inter text-fg m-0 leading-normal">
                                {item.title}
                              </Text>
                              <Text className="font-14 font-inter text-fg-2 m-0 mt-1 max-w-[380px]">
                                {item.description}
                              </Text>
                            </Column>
                            <Column className="w-[8%] text-right align-middle">
                              <Img
                                src="/static/collage/collage-image-9.png"
                                alt=""
                                width={12}
                                height={12}
                                className="inline-block border-none align-middle"
                              />
                            </Column>
                          </Row>
                        </Section>
                      ))}
                    </Section>
                  </Section>
                </Section>

                <Section className="p-0">
                  <Img
                    src="/static/collage/collage-image-4.png"
                    alt=""
                    width={608}
                    className="block w-full max-w-[608px] border-none"
                  />
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

export default WelcomeEmail;
