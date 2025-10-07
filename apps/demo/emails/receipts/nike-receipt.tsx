import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const NikeReceiptEmail = () => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white font-nike">
        <Preview>
          Get your order summary, estimated delivery date and more
        </Preview>
        <Container className="my-[10px] mx-auto w-[600px] max-w-full border border-[#E5E5E5]">
          <Section className="py-[22px] px-10 bg-[#F7F7F7]">
            <Row>
              <Column>
                <Text className="m-0 text-[14px] leading-[2] font-bold">Tracking Number</Text>
                <Text className="mt-3 mb-0 font-medium text-[14px] leading-[1.4] text-[#6F6F6F]">
                  1ZV218970300071628
                </Text>
              </Column>
              <Column align="right">
                <Link className="border border-solid border-[#929292] text-[16px] no-underline py-[10px] px-0 w-[220px] block text-center font-medium text-black">
                  Track Package
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr className="border-[#E5E5E5] m-0" />
          <Section className="py-10 px-[74px] text-center">
            <Img
              src={`${baseUrl}/static/nike-logo.png`}
              width="66"
              height="22"
              alt="Nike"
              className="mx-auto"
            />
            <Heading className="text-[32px] leading-[1.3] font-bold text-center -tracking-[1px]">
              It's On Its Way.
            </Heading>
            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
              You order's is on its way. Use the link above to track its
              progress.
            </Text>
            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium mt-6">
              We´ve also charged your payment method for the cost of your order
              and will be removing any authorization holds. For payment details,
              please visit your Orders page on Nike.com or in the Nike app.
            </Text>
          </Section>
          <Hr className="border-[#E5E5E5] m-0" />
          <Section className="py-[22px] px-10">
            <Text className="m-0 text-[15px] leading-[2] font-bold">
              Shipping to: Alan Turing
            </Text>
            <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
              2125 Chestnut St, San Francisco, CA 94123
            </Text>
          </Section>
          <Hr className="border-[#E5E5E5] m-0" />
          <Section className="py-10 px-10">
            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/static/nike-product.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  className="float-left"
                  width="260px"
                />
              </Column>
              <Column className="align-top pl-3">
                <Text className="m-0 text-[14px] leading-[2] font-medium">
                  Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey
                </Text>
                <Text className="m-0 text-[14px] leading-[2] text-[#747474] font-medium">
                  Size L (12–14)
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr className="border-[#E5E5E5] m-0" />
          <Section className="py-[22px] px-10">
            <Row className="inline-flex mb-10">
              <Column className="w-[170px]">
                <Text className="m-0 text-[14px] leading-[2] font-bold">Order Number</Text>
                <Text className="mt-3 mb-0 font-medium text-[14px] leading-[1.4] text-[#6F6F6F]">
                  C0106373851
                </Text>
              </Column>
              <Column>
                <Text className="m-0 text-[14px] leading-[2] font-bold">Order Date</Text>
                <Text className="mt-3 mb-0 font-medium text-[14px] leading-[1.4] text-[#6F6F6F]">
                  Sep 22, 2022
                </Text>
              </Column>
            </Row>
            <Row>
              <Column align="center">
                <Link className="border border-[#929292] no-underline py-[10px] px-0 w-[220px] text-[16px] block text-center font-medium text-black">
                  Order Status
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr className="border-[#E5E5E5] m-0" />
          <Section className="py-[22px]">
            <Row>
              <Text className="text-[32px] leading-[1.3] font-bold text-center tracking-[-1px]">
                Top Picks For You
              </Text>
            </Row>
            <Row className="py-5">
              <Column className="align-top text-left pl-1 pr-[2px]" align="center">
                <Img
                  src={`${baseUrl}/static/nike-recomendation-1.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  width="100%"
                />
                <Text className="m-0 text-[15px] leading-none px-[10px] pt-3 font-medium">
                  USWNT 2022/23 Stadium Home
                </Text>
                <Text className="m-0 text-[15px] leading-none px-[10px] pt-1 text-[#747474]">
                  Women's Nike Dri-FIT Soccer Jersey
                </Text>
              </Column>
              <Column className="align-top text-left pl-[2px] pr-[2px]" align="center">
                <Img
                  src={`${baseUrl}/static/nike-recomendation-2.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  width="100%"
                />
                <Text className="m-0 text-[15px] leading-none px-[10px] pt-3 font-medium">
                  Brazil 2022/23 Stadium Goalkeeper
                </Text>
                <Text className="m-0 text-[15px] leading-none px-[10px] pt-1 text-[#747474]">
                  Men's Nike Dri-FIT Short-Sleeve Football Shirt
                </Text>
              </Column>
              <Column className="align-top text-left pl-[2px] pr-[2px]" align="center">
                <Img
                  src={`${baseUrl}/static/nike-recomendation-4.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  width="100%"
                />
                <Text className="m-0 text-[15px] leading-none px-[10px] pt-3 font-medium">
                  FFF
                </Text>
                <Text className="m-0 text-[15px] leading-none px-[10px] pt-1 text-[#747474]">
                  Women's Soccer Jacket
                </Text>
              </Column>
              <Column className="align-top text-left pl-[2px] pr-1" align="center">
                <Img
                  src={`${baseUrl}/static/nike-recomendation-4.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  width="100%"
                />
                <Text className="m-0 text-[15px] leading-none px-[10px] pt-3 font-medium">
                  FFF
                </Text>
                <Text className="m-0 text-[15px] leading-none px-[10px] pt-1 text-[#747474]">
                  Women's Nike Pre-Match Football Top
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr className="border-[#E5E5E5] m-0" />
          <Section className="px-5 pt-5 bg-[#F7F7F7]">
            <Row>
              <Text className="px-5 font-bold">Get Help</Text>
            </Row>
            <Row className="py-[22px] px-5">
              <Column className="w-1/3" colSpan={1}>
                <Link
                  href="https://www.nike.com/"
                  className="text-[13.5px] mt-0 font-medium text-black"
                >
                  Shipping Status
                </Link>
              </Column>
              <Column className="w-1/3" colSpan={1}>
                <Link
                  href="https://www.nike.com/"
                  className="text-[13.5px] mt-0 font-medium text-black"
                >
                  Shipping & Delivery
                </Link>
              </Column>
              <Column className="w-1/3" colSpan={1}>
                <Link
                  href="https://www.nike.com/"
                  className="text-[13.5px] mt-0 font-medium text-black"
                >
                  Returns & Exchanges
                </Link>
              </Column>
            </Row>
            <Row className="pb-[22px] px-5 pt-0">
              <Column className="w-1/3" colSpan={1}>
                <Link
                  href="https://www.nike.com/"
                  className="text-[13.5px] mt-0 font-medium text-black"
                >
                  How to Return
                </Link>
              </Column>
              <Column className="w-2/3" colSpan={2}>
                <Link
                  href="https://www.nike.com/"
                  className="text-[13.5px] mt-0 font-medium text-black"
                >
                  Contact Options
                </Link>
              </Column>
            </Row>
            <Hr className="border-[#E5E5E5] m-0" />
            <Row className="px-5 pt-8 pb-[22px]">
              <Column>
                <Row>
                  <Column className="w-4">
                    <Img
                      src={`${baseUrl}/static/nike-phone.png`}
                      alt="Nike Phone"
                      width="16px"
                      height="26px"
                      className="pr-[14px]"
                    />
                  </Column>
                  <Column>
                    <Text className="text-[13.5px] mt-0 font-medium text-black mb-0">
                      1-800-806-6453
                    </Text>
                  </Column>
                </Row>
              </Column>
              <Column>
                <Text className="text-[13.5px] mt-0 font-medium text-black mb-0">
                  4 am - 11 pm PT
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr className="border-[#E5E5E5] m-0" />
          <Section className="py-[22px]">
            <Row>
              <Text className="text-[32px] leading-[1.3] font-bold text-center -tracking-[1px]">
                Nike.com
              </Text>
            </Row>
            <Row className="w-[370px] mx-auto pt-3">
              <Column align="center">
                <Link
                  href="https://www.nike.com/"
                  className="font-medium text-black"
                >
                  Men
                </Link>
              </Column>
              <Column align="center">
                <Link
                  href="https://www.nike.com/"
                  className="font-medium text-black"
                >
                  Women
                </Link>
              </Column>
              <Column align="center">
                <Link
                  href="https://www.nike.com/"
                  className="font-medium text-black"
                >
                  Kids
                </Link>
              </Column>
              <Column align="center">
                <Link
                  href="https://www.nike.com/"
                  className="font-medium text-black"
                >
                  Customize
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr className="border-[#E5E5E5] m-0 mt-3" />
          <Section className="py-[22px]">
            <Row className="w-[166px] mx-auto">
              <Column>
                <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                  Web Version
                </Text>
              </Column>
              <Column>
                <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                  Privacy Policy
                </Text>
              </Column>
            </Row>
            <Row>
              <Text className="m-0 text-[#AFAFAF] text-[13px] text-center py-[30px]">
                Please contact us if you have any questions. (If you reply to
                this email, we won't be able to see it.)
              </Text>
            </Row>
            <Row>
              <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                © 2022 Nike, Inc. All Rights Reserved.
              </Text>
            </Row>
            <Row>
              <Text className="m-0 text-[#AFAFAF] text-[13px] text-center">
                NIKE, INC. One Bowerman Drive, Beaverton, Oregon 97005, USA.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default NikeReceiptEmail;
