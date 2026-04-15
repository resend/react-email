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
import type { OrderLine } from './order-confirmation';
import { TechFonts } from './tech-fonts';
import { techTailwindConfig } from './theme';

type ShippingFaqItem = {
  title: string;
  body: string;
};

interface TechOrderShippingEmailProps {
  companyName?: string;
  url?: string;
}

const techOrderShippingLines: OrderLine[] = [
  {
    name: 'Halo Ring 1',
    quantity: 'x1',
    imageSrc: '/static/tech/tech-image-2.png',
  },
];

const techOrderShippingFaqItems: ShippingFaqItem[] = [
  {
    title: 'When will my ring arrive?',
    body: 'Most domestic Halo orders land in 3–5 business days after the carrier scan—watch your tracking link for live updates.',
  },
  {
    title: 'Need a different size?',
    body: 'Start an exchange from your order page within 30 days. We’ll help you resize or swap finishes while stock allows.',
  },
  {
    title: 'Is my shipment protected?',
    body: 'Every ring ships insured with signature options in select regions—check tracking for delivery preferences.',
  },
  {
    title: 'Can I change the address?',
    body: 'Contact support fast if the package hasn’t left our hub; once it’s moving, carriers require you to redirect with them.',
  },
];

/** Figma Email-Templates `2738:4169` — Tech shipping notification (track CTA, line items, FAQ strip). */
export const TechOrderShippingEmail = ({
  companyName = 'Halo',
  url = 'https://example.com/',
}: TechOrderShippingEmailProps) => {
  return (
    <Tailwind config={techTailwindConfig}>
      <Html>
        <Head>
          <TechFonts />
        </Head>
        <Preview>Your {companyName} ring order #1234567890 has shipped</Preview>
        <Body className="bg-bg-2 m-0 p-0">
          <Container className="mx-auto w-full max-w-[640px]">
            <Section className="bg-bg-3 px-0 pt-14 text-center">
              <Section className="px-6 pb-[56px]">
                <Section className="mb-8">
                  <Img
                    src="/static/tech/logo-wordmark.png"
                    alt="Logo"
                    width={64}
                    className="block mx-auto"
                  />
                </Section>

                <Section className="mx-auto">
                  <Section className="max-w-[420px]">
                    <Text className="m-0 font-40 font-geist text-fg">
                      Your Order has Shipped
                    </Text>
                    <Text className="m-0 mt-6 font-14 font-sans text-fg-2">
                      Order #1234567890 with your Halo ring is on the way. Tap
                      track below—we&apos;ll ping you if delivery details shift.
                    </Text>

                    <Section className="mt-12">
                      <Button
                        href={url}
                        className="inline-block bg-white px-[20px] py-[12px] border border-button-border rounded-[8px] font-15 font-sans text-[#1F2222]"
                      >
                        {'Track your order \u2192'}
                      </Button>
                    </Section>
                  </Section>

                  <Section className="pt-16 text-left">
                    <Section className="bg-bg-4 mt-0 mb-6 px-2 py-2 rounded-[16px] text-left">
                      <Row>
                        <Column className="w-[80px] align-middle">
                          <Section className="rounded-[12px] w-[80px]">
                            <Img
                              src="/static/tech/tech-image.png"
                              alt="Halo Ring 1"
                              width={80}
                              className="block rounded-[12px] w-full max-w-[80px]"
                            />
                          </Section>
                        </Column>
                        <Column className="pl-4 align-middle">
                          <Text className="m-0 font-15 font-sans text-fg">
                            Halo Ring 1
                          </Text>
                          <Text className="m-0 mt-1 font-14 font-sans text-fg-3">
                            x1
                          </Text>
                        </Column>
                      </Row>
                    </Section>

                    <Section className="mt-12 border-stroke border-t">
                      &nbsp;
                    </Section>
                    <Section className="mt-6 text-center">
                      <Text className="m-0 mx-auto max-w-[300px] font-14 font-sans text-fg-3">
                        After dispatch we can’t edit items, but you can follow
                        or reroute delivery through the carrier’s tools anytime.
                      </Text>
                    </Section>
                  </Section>

                  <Section className="mt-12 px-6 mobile:px-2 pt-12 border-stroke border-t text-left">
                    <Text className="m-0 font-16 font-geist text-fg-3">
                      Common questions
                    </Text>
                    <Section className="mt-10">
                      {techOrderShippingFaqItems.map((item, idx) => (
                        <Section key={idx} className={idx > 0 ? 'mt-10' : ''}>
                          <Text className="m-0 font-22 font-sans text-fg">
                            {item.title}
                          </Text>
                          <Text className="m-0 mt-3 font-14 font-sans text-fg-2">
                            {item.body}
                          </Text>
                        </Section>
                      ))}
                      <Section className="mt-10">
                        <Button
                          href={url}
                          className="inline-block bg-white px-[20px] py-[12px] border border-button-border rounded-[8px] font-15 font-sans text-[#1F2222]"
                        >
                          More
                        </Button>
                      </Section>
                    </Section>
                  </Section>
                </Section>
              </Section>
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
                          src="/static/shared/social-x-black.png"
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
                          src="/static/shared/social-in-black.png"
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
                          src="/static/shared/social-yt-black.png"
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
                          src="/static/shared/social-gh-black.png"
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

export default TechOrderShippingEmail;
