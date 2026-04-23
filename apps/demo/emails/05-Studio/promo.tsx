// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

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
import { TechFonts } from './tech-fonts';
import { techTailwindConfig } from './theme';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

interface TechPromoEmailProps {
  companyName: string;
  url: string;
}

type BenefitItem = {
  title: string;
};

const techPromoBenefits: BenefitItem[] = [
  { title: 'Try your ring risk-free 30 days' },
  { title: 'Free shipping and easy returns' },
  { title: 'Two-year ring warranty included' },
];

/** Figma Email-Templates `2743:1053` — Tech promo (hero, code + redeem, features, join). */
export const TechPromoEmail = ({ companyName, url }: TechPromoEmailProps) => {
  return (
    <Tailwind config={techTailwindConfig}>
      <Html>
        <Head>
          <TechFonts />
        </Head>

        <Body className="bg-bg-3 m-0 p-0">
          <Preview>Your {companyName} promo code</Preview>
          <Container className="mx-auto max-w-[640px]">
            <Section className="bg-fg px-2 py-4 text-center">
              <Text className="m-0 font-14 font-sans text-bg">
                Black Friday Sale: Save up to $80 on Halo
              </Text>
            </Section>

            <Section className="bg-[#E8E8E8]">
              <Section className="px-0 pt-10 pb-12 text-center">
                <Img
                  src={`${baseUrl}/static/tech/logo-wordmark.png`}
                  alt={`${companyName} logo`}
                  width={64}
                  className="block mx-auto"
                />

                <Text className="m-0 mx-auto mt-8 max-w-[440px] font-48 font-geist text-fg">
                  Save on the ring that keeps you clear
                </Text>
              </Section>

              <Section className="mt-8">
                <Img
                  src={`${baseUrl}/static/tech/tech-image-5.png`}
                  alt="Halo ring"
                  width={608}
                  className="block w-full"
                />
              </Section>

              <Section className="bg-white pt-10 text-center">
                <Button
                  href={url}
                  className="inline-block bg-white px-5 py-3 border border-button-border rounded-[8px] font-15 font-sans text-fg"
                >
                  Save up to $80
                </Button>
                <Text className="m-0 mt-4 font-11 font-sans text-fg-2">
                  Limited time only
                </Text>

                <Img
                  src={`${baseUrl}/static/tech/tech-image-6.png`}
                  alt="Halo ring"
                  width={608}
                  className="block w-full"
                />
              </Section>
            </Section>

            <Section className="px-8 pt-8 pb-20">
              <Section className="bg-bg-4 mt-10 px-12 mobile:px-4 py-20 rounded-[10px] text-center">
                <Text className="m-0 font-20 font-sans text-fg-2">★★★★★</Text>
                <Text className="m-0 mt-5 font-22 font-sans text-fg">
                  &ldquo;It&apos;s wild how fast Halo on my finger felt like
                  calm help whenever my head was full and my hands were
                  busy.&rdquo;
                </Text>
              </Section>

              <Section className="mt-12 px-6 w-full">
                <Row>
                  {techPromoBenefits.map((item, idx) => (
                    <Column
                      key={idx}
                      className="mobile:!block px-1 w-1/4 mobile:!w-full mobile:!max-w-full text-center align-top"
                    >
                      <Text className="m-0 mx-auto max-w-[120px] font-15 text-fg text-center">
                        {item.title}
                      </Text>
                    </Column>
                  ))}
                </Row>
              </Section>
            </Section>

            <Section className="mt-12 mb-12 text-center">
              <Button
                href={url}
                className="inline-block bg-white px-5 py-3 border border-button-border rounded-[8px] font-15 font-sans text-fg"
              >
                Shop Black Friday Sale
              </Button>
            </Section>

            <Section className="px-6 py-20 text-center">
              <Section className="mx-auto max-w-[320px]">
                <Text className="m-0 font-13 font-sans text-fg-2">
                  {companyName} is the AI ring on your finger—easy shopping,
                  clear shipping, and real support when you need it.
                </Text>

                <Section className="mx-auto mt-8 mb-8 w-fit">
                  <Row>
                    <Column className="pr-[32px] w-[20px]">
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
                        <Img
                          src={`${baseUrl}/static/shared/social-x-black.png`}
                          alt="X"
                          width={20}
                          height={20}
                          className="block"
                        />
                      </Link>
                    </Column>
                    <Column className="pr-[32px] w-[20px]">
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
                        <Img
                          src={`${baseUrl}/static/shared/social-in-black.png`}
                          alt="LinkedIn"
                          width={20}
                          height={20}
                          className="block"
                        />
                      </Link>
                    </Column>
                    <Column className="pr-[32px] w-[20px]">
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
                        <Img
                          src={`${baseUrl}/static/shared/social-yt-black.png`}
                          alt="YouTube"
                          width={20}
                          height={20}
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
                          src={`${baseUrl}/static/shared/social-gh-black.png`}
                          alt="GitHub"
                          width={20}
                          height={20}
                          className="block"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>

                <Text className="m-0 font-11 font-sans text-fg-2">
                  123 Market Street, Floor 1
                  <br />
                  Tech City, CA, 94102
                </Text>
                <Text className="m-0 mt-5 font-11 font-sans text-fg-2">
                  <Link href="https://example.com/" className="text-fg-2">
                    Unsubscribe
                  </Link>{' '}
                  from {companyName} marketing emails.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

TechPromoEmail.PreviewProps = {
  companyName: 'Halo',
  url: 'https://example.com/',
} satisfies TechPromoEmailProps;

export default TechPromoEmail;
