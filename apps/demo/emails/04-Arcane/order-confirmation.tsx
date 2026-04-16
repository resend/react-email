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

export type OrderLine = { name: string; quantity: string; imageSrc: string };
interface OrderConfirmationEmailProps {
  companyName: string;
  url: string;
}
const orderConfirmationLines: OrderLine[] = [
  {
    name: 'Daily C Serum',
    quantity: 'x1',
    imageSrc: `${baseUrl}/static/skin/skin-image-2.png`,
  },
  {
    name: 'Overnight Repair Cream',
    quantity: 'x1',
    imageSrc: `${baseUrl}/static/skin/skin-image-3.png`,
  },
];
export const OrderConfirmationEmail = ({
  companyName,
  url,
}: OrderConfirmationEmailProps) => {
  return (
    <Tailwind config={skinTailwindConfig}>
      <Html>
        <Head>
          <SkinFonts />
        </Head>

        <Body className="m-0 bg-white p-0 font-15 font-sans">
          <Preview>Your {companyName} order #1234567890 is confirmed</Preview>
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
              <Section className="mobile:px-6 px-[40px] pt-[80px] pb-[56px]">
                <Section className="mb-[48px]">
                  <Text className="font-72 text-fg mb-8 max-w-[480px] font-serif">
                    Your order has been placed
                  </Text>
                  <Text className="font-15 text-fg-2 m-0 mt-3 max-w-[480px] font-sans">
                    Your order #1234567890 has been confirmed!
                  </Text>
                  <Text className="font-15 text-fg-2 m-0 max-w-[480px] font-sans">
                    We&apos;ll send tracking as soon as your parcel leaves our
                    studio, usually within one business day.
                  </Text>
                </Section>
                <Link href={url} className="font-16 text-fg font-sans">
                  {'Track your order \u2192'}
                </Link>

                <Section className="mt-[64px]">
                  <Section className="mb-[24px]">
                    {orderConfirmationLines.map((line, idx) => (
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

                  <Section className="bg-bg-2 border-bg mt-[64px] border">
                    <Row className="p-[12px]">
                      <Column>
                        <Text className="font-15 text-fg-3 m-0 font-sans">
                          Subtotal
                        </Text>
                      </Column>
                      <Column align="right">
                        <Text className="font-15 text-fg-3 m-0 font-sans">
                          $198.00
                        </Text>
                      </Column>
                    </Row>
                    <Row className="border-bg border-t p-[12px]">
                      <Column>
                        <Text className="font-15 text-fg-3 m-0 font-sans">
                          Tax
                        </Text>
                      </Column>
                      <Column align="right">
                        <Text className="font-15 text-fg-3 m-0 font-sans">
                          $16.00
                        </Text>
                      </Column>
                    </Row>
                    <Row className="border-bg border-t p-[12px]">
                      <Column>
                        <Text className="font-15 text-fg-3 m-0 font-sans">
                          Shipping
                        </Text>
                      </Column>
                      <Column align="right">
                        <Text className="font-15 text-fg-3 m-0 font-sans">
                          $0.00
                        </Text>
                      </Column>
                    </Row>
                    <Row className="border-bg border-t p-[12px]">
                      <Column>
                        <Text className="font-15 text-fg m-0 font-sans">
                          Total
                        </Text>
                      </Column>
                      <Column align="right">
                        <Text className="font-15 text-fg m-0 font-sans">
                          $214.00
                        </Text>
                      </Column>
                    </Row>
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
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
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
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
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
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
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
                          <Link
                            href="https://example.com/"
                            className="inline-block"
                          >
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

OrderConfirmationEmail.PreviewProps = {
  companyName: 'Skin',
  url: 'https://example.com/',
} satisfies OrderConfirmationEmailProps;

export default OrderConfirmationEmail;
