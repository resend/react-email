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

type NewsletterTip = {
  step: number;
  title: string;
  body: string;
  ctaLabel: string;
};
type NewsletterCommunity = {
  imageSrc: string;
  headline: string;
  body: string;
  ctaLabel: string;
};
interface NewsletterEmailProps {
  companyName: string;
  url: string;
}
const newsletterLetterParagraphs = [
  "We're glad you're here. This is where we share routine notes, ingredient spotlights, and first word on drops—plus the occasional restock alert before shelves clear.",
  'No inbox clutter—just emails when we have something worth your time. Thanks for letting us sit next to your morning serum and your evening wind-down.',
];
const newsletterTips: NewsletterTip[] = [
  {
    step: 1,
    title: 'Start with a patch test',
    body: "Try new textures on a small area first, especially if you're rotating in actives or seasonal formulas.",
    ctaLabel: 'Learn more \u2192',
  },
  {
    step: 2,
    title: 'Layer for your climate',
    body: "Humidity, cold snaps, and travel all change how skin drinks product layers in heat, richer barriers when it's dry.",
    ctaLabel: 'Learn more \u2192',
  },
  {
    step: 3,
    title: 'Track what works',
    body: 'Note how your skin feels after AM and PM routines so you can double down on what actually moves the needle.',
    ctaLabel: 'Learn more \u2192',
  },
];

const newsletterCommunity: NewsletterCommunity = {
  imageSrc: '/static/skin/skin-image-5.png',
  headline:
    'Most members say one or two routine swaps moved the needle more than a dozen impulse buys.',
  body: 'Peek behind the formulas—short guides, founder notes, and community answers so you shop for your skin, not the algorithm.',
  ctaLabel: 'See what\u2019s new \u2192',
};
export const NewsletterEmail = ({ companyName, url }: NewsletterEmailProps) => {
  const quoteText =
    'Shopping with ' +
    companyName +
    ' finally made my counter feel calm—every product earns its spot, and my skin stays predictable through travel and stress.';
  return (
    <Tailwind config={skinTailwindConfig}>
      <Html>
        <Head>
          <SkinFonts />
        </Head>
        <Preview>The latest from {companyName}</Preview>
        <Body className="m-0 bg-white p-0 font-15 font-sans">
          <Section className="bg-white m-0 w-full p-0 pt-[92px] mobile:pt-0">
            <Container className="bg-bg mx-auto w-full max-w-[640px]">
              <Section className="bg-bg mobile:px-6 px-[40px] pt-[40px] pb-[24px]">
                <Img
                  src="/static/shared/logo-white.png"
                  alt=""
                  width="32"
                  height="32"
                  className="block"
                />
              </Section>
              <Section className="mobile:px-6 px-[40px] pb-[80px]">
                <Text className="font-72 text-fg m-0 mt-[64px] font-serif capitalize">
                  Newsletter
                </Text>
                <Text className="font-15 text-fg-2 m-0 mt-[32px] max-w-[430px] font-sans">
                  Hi there,
                </Text>
                {newsletterLetterParagraphs.map((p, i) => (
                  <Text
                    key={i}
                    className="font-15 text-fg-2 m-0 mt-[32px] max-w-[430px] font-sans"
                  >
                    {p}
                  </Text>
                ))}
                <Text className="font-15 text-fg m-0 mt-[32px] max-w-[430px] font-sans">
                  Thanks for reading, <br /> The {companyName} team
                </Text>
              </Section>

              <Section className="bg-bg-2">
                <Img
                  src="/static/skin/skin-image-4.png"
                  alt=""
                  width={640}
                  className="block w-full max-w-[640px]"
                />
              </Section>
              <Section className="mobile:px-6 mobile:pt-12 px-[40px] pt-[88px]">
                <Text className="mobile:mt-10 font-72 text-fg m-0 mt-[64px] font-serif capitalize">
                  Tips and resources
                </Text>
                {newsletterTips.map((tip, idx) => (
                  <Section
                    key={idx}
                    className={
                      idx === 0
                        ? 'mobile:mt-12 mt-[88px]'
                        : 'mobile:mt-10 mt-[80px]'
                    }
                  >
                    <Row>
                      <Column className="mobile:!block mobile:!w-full mobile:!max-w-full w-[260px] max-w-[260px] align-top">
                        <Row>
                          <Column className="w-[40px] align-top">
                            <Section className="bg-bg-2 w-[40px] text-center">
                              <Text className="font-20 text-fg m-0 font-serif">
                                {tip.step}
                              </Text>
                            </Section>
                          </Column>
                          <Column className="mobile:!hidden w-[22px]" />
                          <Column className="mobile:pl-3 mobile:!max-w-full align-top">
                            <Text className="font-15 text-fg m-0 font-sans">
                              {tip.title}
                            </Text>
                          </Column>
                        </Row>
                      </Column>
                      <Column className="mobile:!hidden w-[20px]" />
                      <Column className="mobile:!block mobile:pt-6 mobile:!w-full mobile:!max-w-full align-top">
                        <Text className="mobile:!max-w-full font-15 text-fg m-0 font-sans">
                          {tip.body}
                        </Text>
                        <Section className="mt-[8px]">
                          <Link
                            href="https://example.com/"
                            className="font-15 text-fg font-sans"
                          >
                            {tip.ctaLabel}
                          </Link>
                        </Section>
                      </Column>
                    </Row>
                  </Section>
                ))}
              </Section>

              <Section className="mobile:px-6 px-[40px] pt-[104px]">
                <Text className="font-48 text-fg m-0 font-serif">
                  &ldquo;{quoteText}&rdquo;
                </Text>
                <Section className="mt-[48px]">
                  <Text className="font-20 text-fg m-0 font-sans">
                    Alex Morgan
                  </Text>
                  <Text className="font-20 text-fg-2 m-0 font-sans">
                    Member since 2024
                  </Text>
                </Section>
              </Section>

              <Section className="mobile:px-6 px-[40px] pt-[48px] pb-[56px]">
                <Section className="bg-bg-2 rounded-[2px]">
                  <Img
                    src={newsletterCommunity.imageSrc}
                    alt=""
                    width={560}
                    className="block w-full max-w-[560px]"
                  />
                </Section>
                <Section className="mt-[56px]">
                  <Text className="font-24 text-fg m-0 max-w-[480px] font-sans">
                    {newsletterCommunity.headline}
                  </Text>
                  <Text className="font-18 text-fg-2 m-0 mt-[20px] max-w-[430px] font-sans">
                    {newsletterCommunity.body}
                  </Text>
                  <Section className="mt-[32px]">
                    <Link href={url} className="font-16 text-fg font-sans">
                      {newsletterCommunity.ctaLabel}
                    </Link>
                  </Section>
                </Section>
              </Section>

              {/* Footer */}
              <Section className="mobile:px-6 border-stroke mt-8 border-t px-[40px] pt-[80px] pb-[64px]">
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
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
                            <Img
                              src="/static/skin/social-x.png"
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
                              src="/static/skin/social-li.png"
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
                              src="/static/skin/social-yt.png"
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
                              src="/static/skin/social-gh.png"
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
                      <Link href="https://example.com/" className="text-fg-2">
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

NewsletterEmail.PreviewProps = {
  companyName: 'Skin',
  url: 'https://example.com/',
} satisfies NewsletterEmailProps;

export default NewsletterEmail;
