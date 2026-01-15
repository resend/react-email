import {
  Body,
  Column,
  Container,
  Head,
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

interface AICalendarReceiptEmailProps {
  userFirstName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  planName?: string;
  planPrice?: string;
  billingPeriod?: string;
  paymentMethod?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const AICalendarReceiptEmail = ({
  userFirstName,
  invoiceNumber,
  invoiceDate,
  planName,
  planPrice,
  billingPeriod,
  paymentMethod,
}: AICalendarReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] font-ai-calendar">
          <Preview>Your AI Calendar Assistant receipt</Preview>
          <Container className="bg-white mx-auto py-8 px-12 mb-16">
            <Section>
              <Row>
                <Column>
                  <Img
                    src={`${baseUrl}/static/ai-calendar-logo.png`}
                    width="48"
                    height="48"
                    alt="AI Calendar Assistant"
                  />
                </Column>
                <Column align="right">
                  <Text className="text-[#a3a3a3] text-[12px] m-0">
                    Invoice #{invoiceNumber}
                  </Text>
                  <Text className="text-[#a3a3a3] text-[12px] m-0">
                    {invoiceDate}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-[#e5e5e5] my-6" />

            <Section>
              <Text className="text-[#0a0a0b] text-[24px] font-semibold m-0 mb-2">
                Payment Receipt
              </Text>
              <Text className="text-[#737373] text-base m-0">
                Thank you for your purchase, {userFirstName}!
              </Text>
            </Section>

            <Section className="bg-[#fafafa] rounded-lg p-6 my-6 border border-solid border-[#e5e5e5]">
              <Row>
                <Column>
                  <Text className="text-[#737373] text-[12px] uppercase tracking-wider m-0 mb-1">
                    Plan
                  </Text>
                  <Text className="text-[#0a0a0b] text-[16px] font-semibold m-0">
                    {planName}
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-[#737373] text-[12px] uppercase tracking-wider m-0 mb-1">
                    Amount
                  </Text>
                  <Text className="text-[#0a0a0b] text-[16px] font-semibold m-0">
                    {planPrice}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section>
              <Row className="mb-3">
                <Column>
                  <Text className="text-[#737373] text-[14px] m-0">
                    Billing Period
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-[#0a0a0b] text-[14px] m-0">
                    {billingPeriod}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-3">
                <Column>
                  <Text className="text-[#737373] text-[14px] m-0">
                    Payment Method
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-[#0a0a0b] text-[14px] m-0">
                    {paymentMethod}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-[#e5e5e5] my-6" />

            <Section>
              <Row>
                <Column>
                  <Text className="text-[#0a0a0b] text-[16px] font-semibold m-0">
                    Total Paid
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-[#f97316] text-[24px] font-bold m-0">
                    {planPrice}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-[#e5e5e5] my-6" />

            <Section>
              <Text className="text-[#737373] text-[14px] leading-6">
                Your subscription is now active. You have full access to all{' '}
                {planName} features.
              </Text>
              <Text className="text-[#737373] text-[14px] leading-6">
                Manage your subscription anytime in your{' '}
                <Link
                  className="text-[#f97316]"
                  href="https://aicalendar.app/dashboard/billing"
                >
                  billing settings
                </Link>
                .
              </Text>
            </Section>

            <Section className="mt-8">
              <Text className="text-[#a3a3a3] text-[12px] m-0">
                Questions about your bill?{' '}
                <Link
                  className="text-[#f97316]"
                  href="https://aicalendar.app/support"
                >
                  Contact support
                </Link>
              </Text>
            </Section>

            <Hr className="border-[#e5e5e5] my-6" />

            <Section>
              <Text className="text-[#a3a3a3] text-[11px] m-0">
                AI Calendar Assistant, Inc.
              </Text>
              <Text className="text-[#a3a3a3] text-[11px] m-0">
                San Francisco, CA 94102
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AICalendarReceiptEmail.PreviewProps = {
  userFirstName: 'Alex',
  invoiceNumber: 'INV-2025-001234',
  invoiceDate: 'January 16, 2025',
  planName: 'Pro Plan',
  planPrice: '$12.00',
  billingPeriod: 'Jan 16, 2025 - Feb 16, 2025',
  paymentMethod: 'Visa •••• 4242',
} as AICalendarReceiptEmailProps;

export default AICalendarReceiptEmail;
