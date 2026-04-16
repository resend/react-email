// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

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
import { SkinFonts } from './skin-fonts';
import { skinTailwindConfig } from './theme';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

type WelcomeFeature = {
  title: string;
  body: string;
  ctaLabel: string;
  imageSrc: string;
  imagePosition: 'left' | 'right';
};
interface WelcomeEmailProps {
  companyName: string;
  url: string;
}
const welcomeFeatures: WelcomeFeature[] = [
  {
    title: 'Build your ritual',
    body: 'Layer textures and finishes that match your routine—morning calm, evening wind-down, or both.',
    ctaLabel: 'Learn more \u2192',
    imageSrc: `${baseUrl}/static/skin/skin-image-6.png`,
    imagePosition: 'left',
  },
  {
    title: 'Restocks & drops',
    body: 'Members hear first when favorites return and limited runs go live—stay in the loop from day one.',
    ctaLabel: 'Learn more \u2192',
    imageSrc: `${baseUrl}/static/skin/skin-image-7.png`,
    imagePosition: 'right',
  },
];
export const WelcomeEmail = ({ companyName, url }: WelcomeEmailProps) => {
  return (
    <Tailwind config={skinTailwindConfig}>
      <Html>
        <Head>
          <SkinFonts />
        </Head>

        <Body className="m-0 bg-white p-0 font-15 font-sans">
          <Preview>Welcome to {companyName}</Preview>
          <Section className="m-0 bg-white p-0 pt-[92px] mobile:pt-0">
            <Container className="bg-bg mx-auto w-full max-w-[640px]">
              <Section className="bg-bg mobile:px-6 px-[40px] pt-[40px] pb-[24px]">
                <Img
                  src={`${baseUrl}/static/shared/logo-white.png`}
                  alt=""
                  width="32"
                  height="32"
                  className="block"
                />
              </Section>

              <Section className="mobile:px-6 mobile:pt-12 px-[40px] pt-[64px]">
                <Text className="mobile:!max-w-full font-72 mobile:font-56 text-fg m-0 font-serif capitalize">
                  Welcome
                </Text>
                <Text className="mobile:!max-w-full font-15 text-fg-2 m-0 mt-[24px] max-w-[480px] font-sans">
                  Thank you for joining {companyName}. Your shelf just got a
                  little smarter.
                </Text>
                <Text className="mobile:!max-w-full font-15 text-fg-2 m-0 mt-[4px] max-w-[480px] font-sans">
                  Unlock member perks, restock alerts, and checkout that
                  remembers your routine.
                </Text>
              </Section>

              <Section className="bg-bg-2 mobile:mt-10 mt-[64px]">
                <Img
                  src={`${baseUrl}/static/skin/skin-image-1.png`}
                  alt=""
                  width={640}
                  className="mobile:!max-w-full block w-full max-w-[640px]"
                />
              </Section>

              <Section className="mobile:px-6 mobile:pt-12 px-[40px] pt-[88px]">
                <Text className="mobile:!max-w-full font-72 mobile:font-56 text-fg m-0 max-w-[560px] font-serif capitalize">
                  Some new things
                </Text>
                <Section className="mobile:mt-10 mt-[64px]">
                  {welcomeFeatures.map((feature, idx) => {
                    const isImgLeft = feature.imagePosition === 'left';
                    const imgBlock = (
                      <Column
                        key="img"
                        className={`mobile:!block mobile:!w-full w-[280px] max-w-[280px] align-top mobile:!max-w-full${
                          isImgLeft ? '' : ' mobile:pt-8'
                        }`}
                      >
                        <Img
                          src={feature.imageSrc}
                          alt=""
                          width={280}
                          className="mobile:!max-w-full block w-full max-w-[280px]"
                        />
                      </Column>
                    );
                    const textBlock = (
                      <Column
                        key="txt"
                        className={`mobile:!block mobile:!w-full align-top mobile:!max-w-full${
                          isImgLeft ? ' mobile:pt-8' : ''
                        }`}
                      >
                        <Section className="mobile:py-6 py-[40px]">
                          <Text className="mobile:pr-0 mobile:!max-w-full font-15 text-fg m-0 pr-[32px] font-sans">
                            {feature.title}
                          </Text>
                          <Text className="mobile:!max-w-full font-15 text-fg-2 m-0 mt-[16px] font-sans">
                            {feature.body}
                          </Text>
                          <Section className="mt-[16px]">
                            <Link
                              href={url}
                              className="font-15 text-fg font-sans"
                            >
                              {feature.ctaLabel}
                            </Link>
                          </Section>
                        </Section>
                      </Column>
                    );
                    const gap = (
                      <Column key="gap" className="mobile:!hidden w-[24px]" />
                    );
                    return (
                      <Section
                        key={idx}
                        className={idx > 0 ? 'mobile:mt-10 mt-[64px]' : ''}
                      >
                        <Row className="align-top">
                          {feature.imagePosition === 'left' ? (
                            <>
                              {imgBlock} {gap} {textBlock}
                            </>
                          ) : (
                            <>
                              {textBlock} {gap} {imgBlock}
                            </>
                          )}
                        </Row>
                      </Section>
                    );
                  })}
                </Section>
              </Section>

              <Section className="mobile:px-6 mobile:pt-12 mobile:pb-10 mt-[80px] px-[40px]">
                <Section className="bg-bg-3 px-[40px] py-[80px] text-center">
                  <Text className="font-22 text-fg-inverted text-center font-sans">
                    Join us on the journey
                  </Text>
                  <Text className="font-20 text-fg-inverted mt-[24px] text-center font-sans">
                    There&apos;s more ahead—new drops, member perks, and restock
                    alerts. Explore what&apos;s new and stay in the loop while
                    your cart is on hold.
                  </Text>
                  <Section className="mt-[40px] text-center">
                    <Link
                      href={url}
                      className="font-16 text-fg-inverted font-sans"
                    >
                      {'Start Exploring \u2192'}
                    </Link>
                  </Section>
                </Section>
              </Section>

              {/* Footer */}
              <Section className="mobile:px-6 border-stroke mt-12 border-t px-[40px] pt-[80px] pb-[64px]">
                <Text className="font-13 text-fg-3 m-0 max-w-[320px] font-sans">
                  {companyName} crafts thoughtful skincare—barrier-first
                  formulas, honest labels, and routines you&apos;ll actually
                  keep.
                </Text>
                <Row align="left">
                  <Column className="w-full align-top">
                    <Section align="left" className="mt-8 w-[152px]">
                      <Row align="left">
                        <Column className="w-[20px] pr-6">
                          <Link href={url} className="inline-block">
                            <Img
                              src={`${baseUrl}/static/skin/social-x.png`}
                              alt="X"
                              width="20"
                              height="20"
                              className="block"
                            />
                          </Link>
                        </Column>
                        <Column className="w-[20px] pr-6">
                          <Link href={url} className="inline-block">
                            <Img
                              src={`${baseUrl}/static/skin/social-li.png`}
                              alt="LinkedIn"
                              width="20"
                              height="20"
                              className="block"
                            />
                          </Link>
                        </Column>
                        <Column className="w-[20px] pr-6">
                          <Link href={url} className="inline-block">
                            <Img
                              src={`${baseUrl}/static/skin/social-yt.png`}
                              alt="YouTube"
                              width="20"
                              height="20"
                              className="block"
                            />
                          </Link>
                        </Column>
                        <Column className="w-[20px]">
                          <Link href={url} className="inline-block">
                            <Img
                              src={`${baseUrl}/static/skin/social-gh.png`}
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
                    <Text className="font-11 text-fg-3 m-0 font-sans">
                      124 Mercantile Row, Studio 3
                      <br />
                      Los Angeles, CA, 90013
                    </Text>
                  </Column>
                </Row>
                <Row align="left">
                  <Column className="w-full pt-5 align-top">
                    <Text className="font-11 text-fg-3 m-0 max-w-[169px] font-sans">
                      <Link href={url} className="text-fg-2">
                        Unsubscribe
                      </Link>{' '}
                      from {companyName} marketing emails.
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Container>
          </Section>
        </Body>
      </Html>
    </Tailwind>
  );
};

WelcomeEmail.PreviewProps = {
  companyName: 'Skin',
  url: 'https://example.com/',
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
