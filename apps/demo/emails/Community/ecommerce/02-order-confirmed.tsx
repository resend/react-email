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
import tailwindConfig from '../../tailwind.config';

const demoProductImageUrl = 'https://placehold.co/64x64';

const demoDefaultExternalUrl = 'https://resend.com/emails';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

const demoOrderItems: OrderItem[] = [
  {
    name: 'Wireless noise-canceling headphones',
    quantity: 2,
    price: 150.0,
    image: demoProductImageUrl,
  },
];

interface OrderConfirmedEmailProps {
  companyName?: string;
  customerName?: string;
  orderNumber?: string;
  paymentMethod?: string;
  items?: OrderItem[];
  subtotal?: number;
  total?: number;
  helpCenterUrl?: string;
  unsubscribeUrl?: string;
}

export const OrderConfirmedEmail = ({
  companyName = 'Resend Ecommerce',
  customerName = 'Anna Maria',
  orderNumber = '1234567890',
  paymentMethod = 'Credit card ending in 2032',
  items = demoOrderItems,
  subtotal = 300.0,
  total = 300.0,
  helpCenterUrl = demoDefaultExternalUrl,
  unsubscribeUrl = demoDefaultExternalUrl,
}: OrderConfirmedEmailProps) => (
  <Html dir="ltr" lang="en">
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-[#f4f4f5] m-0 p-0 font-amazon text-[14px] text-[#3f3f46]">
        <Preview>
          Payment confirmed for order #{orderNumber} — we&apos;re already
          preparing your order.
        </Preview>

        <Container className="max-w-[600px] mx-auto my-[32px] bg-white border border-[#e4e4e7]">
          <Section className="px-[48px] pt-[40px] pb-[32px] text-center border-b border-[#f4f4f5]">
            <Text className="text-[11px] leading-[24px] font-semibold text-[#a1a1aa] tracking-[0.15em] uppercase m-0 mb-[12px]">
              {companyName}
            </Text>
            <Text className="text-[24px] leading-[24px] font-bold text-[#18181b] mt-0 mb-[8px] tracking-[-0.025em]">
              Payment confirmed
            </Text>
            <Text className="text-[11px] leading-[24px] text-[#a1a1aa] tracking-[0.1em] uppercase font-medium m-0">
              Order #{orderNumber}
            </Text>
          </Section>

          <Section className="px-[48px] py-[40px]">
            <Text className="text-[14px] leading-[24px] text-[#27272a] font-medium mt-0 mb-[4px]">
              Hi {customerName},
            </Text>
            <Text className="text-[14px] leading-[1.625] text-[#71717a] mt-0 mb-[32px]">
              Great news! Your payment has been confirmed and we&apos;re already
              preparing your order. You&apos;ll receive a shipping notification
              as soon as it&apos;s on the way.
            </Text>

            <Section className="bg-[#fafafa] border border-[#f4f4f5] px-[20px] py-[16px] mb-[32px]">
              <Text className="text-[11px] leading-[24px] font-semibold text-[#71717a] uppercase tracking-[0.05em] mt-0 mb-[8px]">
                Payment details
              </Text>
              <Row>
                <Column className="text-[14px] leading-[24px] text-[#27272a] font-medium">
                  {paymentMethod}
                </Column>
                <Column
                  align="right"
                  className="text-[14px] leading-[24px] text-[#27272a] font-semibold"
                >
                  ${total.toFixed(2)}
                </Column>
              </Row>
            </Section>

            <Text className="text-[11px] leading-[24px] font-semibold text-[#a1a1aa] uppercase tracking-[0.1em] mt-0 mb-[16px]">
              Order summary
            </Text>

            <Section className="border-t border-[#f4f4f5] pt-[16px]">
              {items.map((item, i) => (
                <Row key={i} className="pb-[16px]">
                  <Column className="w-[80px] align-middle">
                    <Img
                      alt="Order product"
                      height={64}
                      width={64}
                      src={item.image}
                      className="block border border-[#f4f4f5]"
                    />
                  </Column>
                  <Column className="pl-[16px] align-middle">
                    <Text className="text-[14px] leading-[24px] font-medium text-[#18181b] mt-0 mb-[2px]">
                      {item.name}
                    </Text>
                    <Text className="text-[12px] leading-[24px] text-[#a1a1aa] m-0">
                      Qty: {item.quantity}
                    </Text>
                  </Column>
                  <Column
                    align="right"
                    className="align-middle font-semibold text-[#18181b]"
                  >
                    ${item.price.toFixed(2)}
                  </Column>
                </Row>
              ))}
            </Section>

            <Section className="border-t border-[#f4f4f5]">
              <Row>
                <Column className="py-[12px] text-[#71717a]">Subtotal</Column>
                <Column align="right" className="py-[12px] text-[#71717a]">
                  ${subtotal.toFixed(2)}
                </Column>
              </Row>
              <Row className="border-t border-[#f4f4f5]">
                <Column className="py-[12px] font-semibold text-[#18181b] text-[16px]">
                  Total
                </Column>
                <Column
                  align="right"
                  className="py-[12px] font-semibold text-[#18181b] text-[16px]"
                >
                  ${total.toFixed(2)}
                </Column>
              </Row>
            </Section>
          </Section>

          <Section className="px-[48px] pt-[32px] pb-[40px] border-t border-[#f4f4f5]">
            <Text className="text-[14px] leading-[1.625] text-[#71717a] mt-0 mb-[20px]">
              Questions about your order? Reply to this email or visit our{' '}
              <Link href={helpCenterUrl} className="text-[#18181b]">
                Help Center
              </Link>
              .
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#27272a] font-medium m-0">
              {companyName}
            </Text>
          </Section>

          <Section className="bg-[#fafafa] border-t border-[#f4f4f5] px-[48px] py-[24px]">
            <Row>
              <Column className="align-middle">
                <Text className="text-[12px] leading-[1.625] text-[#a1a1aa] m-0">
                  You received this email because you placed an order.{' '}
                  <Link href={unsubscribeUrl} className="text-[#18181b]">
                    Unsubscribe
                  </Link>
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default OrderConfirmedEmail;
