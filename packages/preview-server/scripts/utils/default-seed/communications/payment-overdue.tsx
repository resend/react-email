import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Tailwind,
  Text,
} from '@react-email/components';

interface PaymentOverdueProps {
  customerName: string;
  amount: string;
  dueDate: string;
  invoiceLink: string;
}

export default function PaymentOverdue({
  customerName,
  amount,
  dueDate,
  invoiceLink,
}: PaymentOverdueProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-black text-white">
          <Preview>Payment of {amount} is overdue - Action required</Preview>
          <Container className="mx-auto">
            <Heading className="font-bold text-center my-[48px] text-[32px]">
              Payment Overdue
            </Heading>
            <Text>Dear {customerName},</Text>
            <Text>
              We noticed that your payment of {amount} was due on {dueDate} and
              has not been received yet.
            </Text>
            <Text>
              To avoid any service interruption, please process your payment as
              soon as possible.
            </Text>
            <Text className="mb-6">
              You can view and pay your invoice by clicking the button below:
            </Text>
            <Row className="w-full">
              <Column className="w-full">
                <Button
                  href={invoiceLink}
                  className="bg-cyan-300 text-[20px] font-bold text-[#404040] w-full text-center border border-solid border-cyan-900 py-[8px] rounded-[8px]"
                >
                  Pay Now
                </Button>
              </Column>
            </Row>
            <Text className="mt-6">
              If you have already made this payment, please disregard this
              message.
            </Text>
            <Text className="mt-6">- React Email team</Text>
            <Hr style={{ borderTopColor: '#404040' }} />
            <Text className="text-[#606060] font-bold">
              React Email, 999 React St, Email City, EC 12345
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

PaymentOverdue.PreviewProps = {
  customerName: 'Jane Smith',
  amount: '$99.00',
  dueDate: 'June 1st, 2024',
  invoiceLink: 'https://react.email/invoice/123',
} satisfies PaymentOverdueProps;
