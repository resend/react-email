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
import { TechFonts } from './tech-fonts';
import { techTailwindConfig } from './theme';

export type OrderLine = {
  name: string;
  quantity: string;
  imageSrc: string;
};

interface TechOrderConfirmationEmailProps {
  companyName?: string;
  url?: string;
}

/** Figma Email-Templates `2681:2383` — Tech “order placed” card (Geist headline, line items, summary). */
export const TechOrderConfirmationEmail = ({
  companyName = 'Halo',
  url = 'https://example.com/',
}: TechOrderConfirmationEmailProps) => {
  return (
    <Tailwind config={techTailwindConfig}>
      <Html>
        <Head>
          <TechFonts />
        </Head>
        <Preview>
          Your {companyName} ring order #1234567890 is confirmed
        </Preview>
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

                <Section className="mx-auto px-8 mobile:px-0">
                  <Section className="max-w-[420px]">
                    <Text className="m-0 font-40 font-geist text-fg">
                      Your Order has been placed
                    </Text>
                    <Text className="m-0 mt-6 font-14 font-sans text-fg-2">
                      Order #1234567890 is locked in—we&apos;re prepping your
                      Halo rings for shipment and will email the moment they
                      leave our warehouse.
                    </Text>
                    <Text className="m-0 mt-6 font-14 font-sans text-fg-2">
                      Tracking lands in your inbox as soon as the carrier scans
                      the package.
                    </Text>

                    <Section className="mt-12">
                      <Button
                        href={url}
                        className="inline-block border border-button-border bg-white px-[20px] py-[12px] font-15 font-sans text-[#1F2222] rounded-[8px]"
                      >
                        {'Track your order \u2192'}
                      </Button>
                    </Section>
                  </Section>

                  <Section className="pt-16 text-left">
                    <Section className="bg-bg-4 mt-0 mb-6 px-2 py-2 rounded-[16px] text-left">
                      <Row>
                        <Column className="w-[80px] align-middle">
                          <Section className="w-[80px] rounded-[12px]">
                            <Img
                              src="/static/tech/tech-image.png"
                              alt="Halo Ring 1"
                              width={80}
                              className="block w-full max-w-[80px] rounded-[12px]"
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

                    <Section className="pt-6">
                      <Row>
                        <Column>
                          <Text className="m-0 py-[6px] font-14 font-sans text-fg-2">
                            Subtotal
                          </Text>
                        </Column>
                        <Column align="right">
                          <Text className="m-0 py-[6px] font-15 font-sans text-fg-2">
                            $198.00
                          </Text>
                        </Column>
                      </Row>
                      <Row>
                        <Column>
                          <Text className="m-0 py-[6px] font-14 font-sans text-fg-2">
                            Tax
                          </Text>
                        </Column>
                        <Column align="right">
                          <Text className="m-0 py-[6px] font-15 font-sans text-fg-2">
                            $16.00
                          </Text>
                        </Column>
                      </Row>
                      <Row>
                        <Column>
                          <Text className="m-0 py-[6px] font-14 font-sans text-fg-2">
                            Shipping
                          </Text>
                        </Column>
                        <Column align="right">
                          <Text className="m-0 py-[6px] font-15 font-sans text-fg-2">
                            $0.00
                          </Text>
                        </Column>
                      </Row>
                      <Row>
                        <Column>
                          <Text className="m-0 py-3 font-14 font-sans text-fg">
                            Total
                          </Text>
                        </Column>
                        <Column align="right">
                          <Text className="m-0 py-3 font-15 font-sans text-fg">
                            $214.00
                          </Text>
                        </Column>
                      </Row>
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

export default TechOrderConfirmationEmail;
