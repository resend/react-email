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
} from '@react-email/components';
import { SkinFonts } from './skin-fonts';
import { skinTailwindConfig } from './theme';

type CartLine = {
  name: string;
  description: string;
  price: string;
  imageSrc: string;
};
interface AbandonedCartEmailProps {
  companyName?: string;
  url?: string;
}
const abandonedCartLines: CartLine[] = [
  {
    name: 'Daily C Serum',
    description:
      'Brightening daytime serum—still in your cart. Finish checkout before we release the inventory hold.',
    price: '$99',
    imageSrc: '/static/skin/skin-image-2.png',
  },
  {
    name: 'Overnight Repair Cream',
    description:
      'Pairs with your morning serum for AM/PM balance. Limited batches move fast on restocks.',
    price: '$99',
    imageSrc: '/static/skin/skin-image-3.png',
  },
];
export const AbandonedCartEmail = ({
  companyName = 'Skin',
  url = 'https://example.com/',
}: AbandonedCartEmailProps) => {
  return (
    <Tailwind config={skinTailwindConfig}>
      <Html>
        <Head>
          <SkinFonts />
        </Head>
        <Preview>Your {companyName} cart is waiting</Preview>
        <Body className="bg-white m-0 p-0 font-15 font-sans">
          <Section className="bg-white m-0 p-0 pt-[92px] mobile:pt-0">
            <Container className="bg-bg mx-auto w-full max-w-[640px]">
              {/* Header */}
              <Section className="bg-bg px-[40px] pt-[40px] pb-[24px]">
                <Img
                  src="/static/shared/logo-white.png"
                  alt=""
                  width="32"
                  height="32"
                  className="block"
                />
              </Section>

              {/* Cart items */}
              <Section className="px-[40px] mobile:px-6 pt-[80px] mobile:pt-12 pb-[56px] mobile:pb-10">
                <Section className="mb-[48px] mobile:mb-10">
                  <Section className="mb-[56px] mobile:mb-10">
                    <Text className="m-0 max-w-[480px] font-72 font-serif text-fg">
                      Pick up where you left off
                    </Text>
                    <Text className="m-0 mt-[18px] max-w-[480px] font-15 font-sans text-fg-2">
                      Your cart still holds these formulas—checkout soon before
                      limited stock or your hold window expires.
                    </Text>
                  </Section>
                  {abandonedCartLines.slice(0, 2).map((line, idx) => (
                    <Section key={idx} className={idx === 0 ? 'mb-[36px]' : ''}>
                      <Row>
                        <Column className="mobile:!block w-[178px] mobile:!w-full max-w-[178px] mobile:!max-w-full align-middle">
                          <Img
                            src={line.imageSrc}
                            alt=""
                            width={178}
                            className="block w-full max-w-[178px] mobile:!max-w-full"
                          />
                        </Column>
                        <Column className="mobile:!hidden w-[36px]" />
                        <Column className="mobile:!block mobile:pt-6 mobile:!w-full mobile:!max-w-full align-middle">
                          <Text className="m-0 font-32 font-serif text-fg">
                            {line.name}
                          </Text>
                          <Text className="m-0 mt-[12px] max-w-[304px] mobile:!max-w-full font-15 font-sans text-fg-3">
                            {line.description}
                          </Text>
                          <Text className="m-0 mt-[12px] font-20 font-serif text-fg-2">
                            {line.price}
                          </Text>
                        </Column>
                      </Row>
                    </Section>
                  ))}
                </Section>
                <Link href={url} className="font-16 font-sans text-fg">
                  {'Return to cart \u2192'}
                </Link>
              </Section>

              {/* Card Join us */}

              <Section className="mt-[72px] px-[40px] mobile:px-6 mobile:pt-12 mobile:pb-10">
                <Text className="m-0 mb-12 max-w-[480px] font-64 font-serif text-fg">
                  Don’t take it from us
                </Text>

                <Section className="bg-bg-3 px-[40px] py-[80px] text-center">
                  <Text className="font-22 font-sans text-fg-inverted text-center">
                    Join us on the journey
                  </Text>
                  <Text className="mt-[24px] font-20 font-sans text-fg-inverted text-center">
                    There&apos;s more ahead—new drops, member perks, and restock
                    alerts. Explore what&apos;s new and stay in the loop while
                    your cart is on hold.
                  </Text>
                  <Section className="mt-[40px] text-center">
                    <Link
                      href="https://example.com/"
                      className="font-16 font-sans text-fg-inverted"
                    >
                      {'Start Exploring \u2192'}
                    </Link>
                  </Section>
                </Section>
              </Section>

              {/* Footer */}
              <Section className="mt-12 px-[40px] mobile:px-6 pt-[80px] pb-[64px] border-stroke border-t">
                <Text className="m-0 max-w-[320px] font-13 font-sans text-fg-3">
                  {companyName} crafts thoughtful skincare—barrier-first
                  formulas, honest labels, and routines you&apos;ll actually
                  keep.
                </Text>
                <Row align="left">
                  <Column className="w-full align-top">
                    <Section align="left" className="mt-8 w-[152px]">
                      <Row align="left">
                        <Column className="pr-6 w-[20px]">
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
                        <Column className="pr-6 w-[20px]">
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
                        <Column className="pr-6 w-[20px]">
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
                  <Column className="pt-8 w-full align-top">
                    <Text className="m-0 font-11 font-sans text-fg-3">
                      124 Mercantile Row, Studio 3
                      <br />
                      Los Angeles, CA, 90013
                    </Text>
                  </Column>
                </Row>
                <Row align="left">
                  <Column className="pt-5 w-full align-top">
                    <Text className="m-0 max-w-[169px] font-11 font-sans text-fg-3">
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
export default AbandonedCartEmail;
