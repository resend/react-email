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
import tailwindConfig from '../../tailwind.config';

const demoProductImageUrl = 'https://placehold.co/64x64';

const demoDefaultExternalUrl = 'https://react.email';

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

interface OrderShippedEmailProps {
  companyName?: string;
  customerName?: string;
  orderNumber?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
  items?: OrderItem[];
  subtotal?: number;
  total?: number;
  helpCenterUrl?: string;
  unsubscribeUrl?: string;
}

export const OrderShippedEmail = ({
  companyName = 'Ecommerce',
  customerName = 'Anna Maria',
  orderNumber = '1234567890',
  trackingNumber = 'BR2334343000',
  carrier = 'FedEx',
  estimatedDelivery = 'Monday, April 28, 2026',
  trackingUrl = demoDefaultExternalUrl,
  items = demoOrderItems,
  subtotal = 300.0,
  total = 300.0,
  helpCenterUrl = demoDefaultExternalUrl,
  unsubscribeUrl = demoDefaultExternalUrl,
}: OrderShippedEmailProps) => (
  <Html dir="ltr" lang="en">
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-[#f4f4f5] m-0 p-0 font-amazon text-[14px] text-[#3f3f46]">
        <Preview>
          Your order #{orderNumber} is on its way! Track it below.
        </Preview>

        <Container className="max-w-[600px] mx-auto my-[32px] bg-white border border-[#e4e4e7]">
          <Section className="px-[48px] pt-[40px] pb-[32px] text-center border-b border-[#f4f4f5]">
            <Text className="text-[11px] leading-[24px] font-semibold text-[#a1a1aa] tracking-[0.15em] uppercase m-0 mb-[12px]">
              {companyName}
            </Text>
            <Text className="text-[24px] leading-[24px] font-bold text-[#18181b] mt-0 mb-[8px] tracking-[-0.025em]">
              Your order is on its way!
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
              Great news! Your order has been handed off to the carrier and is
              on its way to you. You can track its progress using the
              information below.
            </Text>

            <Section className="bg-[#fafafa] border border-[#f4f4f5] px-[20px] py-[16px] mb-[32px]">
              <Text className="text-[11px] leading-[24px] font-semibold text-[#71717a] uppercase tracking-[0.05em] mt-0 mb-[12px]">
                Shipping information
              </Text>
              <Row className="pb-[8px]">
                <Column className="text-[13px] text-[#71717a]">
                  Tracking number
                </Column>
                <Column
                  align="right"
                  className="text-[13px] text-[#27272a] font-semibold font-mono"
                >
                  {trackingNumber}
                </Column>
              </Row>
              <Row className="pb-[8px]">
                <Column className="text-[13px] text-[#71717a]">Carrier</Column>
                <Column
                  align="right"
                  className="text-[13px] text-[#27272a] font-medium"
                >
                  {carrier}
                </Column>
              </Row>
              <Row>
                <Column className="text-[13px] text-[#71717a]">
                  Est. delivery
                </Column>
                <Column
                  align="right"
                  className="text-[13px] text-[#27272a] font-medium"
                >
                  {estimatedDelivery}
                </Column>
              </Row>
              <Section className="mt-[14px] pt-[14px] border-t border-[#f4f4f5]">
                <Button
                  href={trackingUrl}
                  className="bg-[#18181b] text-white text-[13px] font-medium px-[16px] py-[8px]"
                >
                  Track your package →
                </Button>
              </Section>
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

export default OrderShippedEmail;
