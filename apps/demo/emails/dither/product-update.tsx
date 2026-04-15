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
} from 'react-email';
import { DitherFonts } from './dither-fonts';
import { ditherTailwindConfig } from './theme';

type ProductUpdateFeature = {
  title: string;
  body: string;
  linkText: string;
  linkHref: string;
  imageSrc: string;
  imageLeft: boolean;
};

const productUpdateHeadline = 'THE WORK BEHIND THE WORK';

interface ProductUpdateEmailProps {
  companyName: string;
  url: string;
}

export const ProductUpdateEmail = ({
  companyName,
  url,
}: ProductUpdateEmailProps) => {
  const featureRows: ProductUpdateFeature[] = [
    {
      title: 'Auto-prioritization',
      body: 'All your tasks for the week are surfaced based on urgency and impact.',
      linkText: 'Explore Smart Tasks',
      linkHref: url,
      imageSrc: '/static/dither/dither-image-7.png',
      imageLeft: true,
    },
    {
      title: 'Less manual work',
      body: 'Fewer status updates, more automated work.',
      linkText: 'Read more',
      linkHref: 'https://example.com/',
      imageSrc: '/static/dither/dither-image-4.png',
      imageLeft: false,
    },
    {
      title: 'Less manual work',
      body: 'Fewer status updates, more automated work.',
      linkText: 'Read more',
      linkHref: 'https://example.com/',
      imageSrc: '/static/dither/dither-image-5.png',
      imageLeft: true,
    },
  ];

  return (
    <Tailwind config={ditherTailwindConfig}>
      <Html>
        <Head>
          <title>{`What's new in ${companyName}`}</title>
          <DitherFonts />
        </Head>
        <Preview>What&apos;s new in {companyName}</Preview>
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

            <Section className="mobile:mt-8 mobile:px-4 mt-12 px-6 pb-2">
              <Img
                src="/static/dither/dither-image-6.png"
                alt=""
                width={592}
                className="mobile:!max-w-full block w-full max-w-[592px]"
              />
              <Row align="left">
                <Column align="left" className="w-full">
                  <Section
                    align="left"
                    className="mobile:!max-w-full mt-12 mb-6 w-full max-w-[480px] text-left"
                  >
                    <Text className="font-56 font-condensed mobile:font-40 text-fg m-0 uppercase">
                      {productUpdateHeadline}
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            <Section className="mobile:px-4 px-6 pb-16">
              <Text className="font-14 text-fg-2 m-0 mb-4">
                Here from the {companyName} team.
              </Text>
              <Text className="font-14 text-fg-2 m-0 mb-4">
                This month was about making {companyName} feel smoother, faster,
                and easier to use in everyday work.
              </Text>
              <Text className="font-14 text-fg-2 m-0 mb-4">
                We shipped new features, improved key workflows, and made small
                but meaningful updates that reduce friction across the product.
              </Text>
              <Text className="font-14 text-fg-2 m-0 mb-4">
                A lot of our focus was on simplifying actions, improving
                performance, and responding to feedback from teams using the
                product day to day.
              </Text>
              <Text className="font-14 text-fg-2 m-0">
                We&apos;re continuing to shape {companyName} around real
                workflows—not just features—so everything feels more connected
                and effortless over time.
              </Text>
            </Section>

            <Section className="mobile:px-4 px-6 pb-16">
              <Text className="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase">
                WE LAUNCHED SMART TASKS
              </Text>
              <Section className="mt-12">
                <Img
                  src={featureRows[0].imageSrc}
                  alt=""
                  width={560}
                  className="mobile:!max-w-full block w-full max-w-[560px]"
                />
                <Text className="font-20 font-condensed text-fg m-0 mt-8">
                  {featureRows[0].title}
                </Text>
                <Text className="font-14 text-fg-2 m-0 mt-3.5">
                  {featureRows[0].body}
                </Text>
                <Link
                  href={featureRows[0].linkHref}
                  className="font-15 text-fg-2 mt-3 inline-block"
                >
                  {featureRows[0].linkText}
                </Link>
              </Section>
            </Section>

            <Section className="mobile:px-4 px-6 pb-12">
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
            </Section>

            <Section className="mobile:px-4 px-6 pb-16">
              <Text className="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase">
                READ MORE ON OUR BLOG
              </Text>
              <Section className="mt-12">
                <Row>
                  <Column className="mobile:!block mobile:pr-0 mobile:pb-10 mobile:!w-full mobile:!max-w-full w-[50%] pr-2.5 align-top">
                    <Img
                      src={featureRows[1].imageSrc}
                      alt=""
                      width={269}
                      className="mobile:!max-w-full block w-full max-w-[269px]"
                    />
                    <Section className="pt-6">
                      <Text className="font-20 font-condensed text-fg m-0">
                        {featureRows[1].title}
                      </Text>
                      <Text className="font-14 text-fg-2 m-0 mt-2">
                        {featureRows[1].body}
                      </Text>
                    </Section>
                  </Column>
                  <Column className="mobile:!block mobile:pl-0 mobile:!w-full mobile:!max-w-full w-[50%] pl-2.5 align-top">
                    <Img
                      src={featureRows[2].imageSrc}
                      alt=""
                      width={269}
                      className="mobile:!max-w-full block w-full max-w-[269px]"
                    />
                    <Section className="pt-6">
                      <Text className="font-20 font-condensed text-fg m-0">
                        {featureRows[2].title}
                      </Text>
                      <Text className="font-14 text-fg-2 m-0 mt-2">
                        {featureRows[2].body}
                      </Text>
                    </Section>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section className="mobile:px-4 px-6 pb-16">
              <Text className="font-13 text-fg m-0 font-sans">Need help?</Text>
              <Text className="font-13 text-fg-2 m-0 mt-0.5 font-sans">
                Find guides, tips, and best practices anytime, visit our Help
                Center.
              </Text>
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

ProductUpdateEmail.PreviewProps = {
  companyName: 'Dither',
  url: 'https://example.com/',
} satisfies ProductUpdateEmailProps;

export default ProductUpdateEmail;
