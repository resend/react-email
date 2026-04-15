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
import type { OrderLine } from './order-confirmation';
import { SkinFonts } from './skin-fonts';
import { skinTailwindConfig } from './theme';

type ShippingFaqItem = {
  title: string;
  linkLabel: string;
  linkHref: string;
  imageSrc: string;
};

interface OrderShippingEmailProps {
  companyName: string;
  url: string;
}

const orderShippingLines: OrderLine[] = [
  {
    name: 'Daily C Serum',
    quantity: 'x1',
    imageSrc: '/static/skin/skin-image-2.png',
  },
  {
    name: 'Overnight Repair Cream',
    quantity: 'x1',
    imageSrc: '/static/skin/skin-image-3.png',
  },
];

const orderShippingFaqItems: ShippingFaqItem[] = [
  {
    title: 'Need to change ship date?',
    linkLabel: 'See how \u2192',
    linkHref: 'https://example.com/',
    imageSrc: '/static/skin/skin-image-4.png',
  },
  {
    title: 'Sending to a new address?',
    linkLabel: 'See how \u2192',
    linkHref: 'https://example.com/',
    imageSrc: '/static/skin/skin-image-5.png',
  },
];

export const OrderShippingEmail = ({
  companyName,
  url,
}: OrderShippingEmailProps) => {
  return (
    <Tailwind config={skinTailwindConfig}>
      <Html>
        <Head>
          <SkinFonts />
        </Head>
        <Preview>Your {companyName} order #1234567890 has shipped</Preview>
        <Body className="m-0 bg-white p-0 font-15 font-sans">
          <Section className="m-0 bg-white p-0 pt-[92px] mobile:pt-0">
            <Container className="bg-bg mx-auto w-full max-w-[640px]">
              {/* Header */}
              <Section className="bg-bg mobile:px-6 px-[40px] pt-[40px] pb-[24px]">
                <Img
                  src="/static/shared/logo-white.png"
                  alt=""
                  width="32"
                  height="32"
                  className="block"
                />
              </Section>
              <Section className="mobile:px-6 px-[40px] pt-[80px] pb-[56px]">
                <Section className="mb-[48px]">
                  <Text className="font-72 text-fg mb-8 max-w-[480px] font-serif">
                    Your Order has Shipped
                  </Text>
                  <Text className="font-15 text-fg-2 m-0 mt-3 max-w-[480px] font-sans">
                    Order #1234567890 is on the way.
                  </Text>
                  <Text className="font-15 text-fg-2 m-0 max-w-[480px] font-sans">
                    Track your shipment below, we&apos;ll email if the carrier
                    reroutes or weather slows delivery.
                  </Text>
                </Section>
                <Link href={url} className="font-16 text-fg font-sans">
                  {'Track your order \u2192'}
                </Link>

                {/* Card */}
                <Section className="mt-[64px]">
                  <Section className="mb-[24px]">
                    {orderShippingLines.map((line, idx) => (
                      <Section key={idx}>
                        {idx > 0 ? (
                          <Section className="border-stroke mt-[18px] mb-[18px] border-t">
                            &nbsp;
                          </Section>
                        ) : null}
                        <Row>
                          <Column className="w-[68px] align-middle">
                            <Img
                              src={line.imageSrc}
                              alt=""
                              width={68}
                              className="block w-full max-w-[68px]"
                            />
                          </Column>
                          <Column className="w-[24px]" />
                          <Column className="align-middle">
                            <Text className="font-24 text-fg m-0 font-serif capitalize">
                              {line.name}
                            </Text>
                            <Text className="font-15 text-fg-3 m-0 font-sans">
                              {line.quantity}
                            </Text>
                          </Column>
                        </Row>
                      </Section>
                    ))}
                  </Section>
                </Section>

                <Section className="mt-[48px]">
                  <Link href={url} className="font-16 text-fg font-sans">
                    {'View order \u2192'}
                  </Link>
                </Section>
              </Section>

              {/* Card */}
              <Section className="mobile:px-6 px-[40px] py-[48px]">
                <Text className="font-56 text-fg m-0 font-serif">
                  Common questions
                </Text>
                <Section className="mt-[32px]">
                  {orderShippingFaqItems.map((item, idx) => (
                    <Section key={idx}>
                      <Row>
                        <Column className="px-2 py-8">
                          <Text className="font-16 text-fg m-0 font-sans">
                            {item.title}
                          </Text>
                          <Section className="mt-[8px]">
                            <Link
                              href={item.linkHref}
                              className="font-16 text-fg-3 font-sans"
                            >
                              {item.linkLabel}
                            </Link>
                          </Section>
                        </Column>
                      </Row>
                    </Section>
                  ))}
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

OrderShippingEmail.PreviewProps = {
  companyName: 'Skin',
  url: 'https://example.com/',
} satisfies OrderShippingEmailProps;

export default OrderShippingEmail;
