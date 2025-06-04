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

interface AccountConfirmationProps {
  confirmLink: string;
  expiryTime: string;
}

export default function AccountConfirmation({
  confirmLink,
  expiryTime,
}: AccountConfirmationProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-black text-white">
          <Preview>Confirm your React Email account</Preview>
          <Container className="mx-auto">
            <Heading className="font-bold text-center my-[48px] text-[32px]">
              Welcome to React Email!
            </Heading>
            <Text>
              Thank you for signing up! To complete your registration and start
              using React Email, please confirm your email address.
            </Text>
            <Text className="mb-6">
              Click the button below to verify your email. This link will expire
              in {expiryTime}.
            </Text>
            <Row className="w-full">
              <Column className="w-full">
                <Button
                  href={confirmLink}
                  className="bg-cyan-300 text-[20px] font-bold text-[#404040] w-full text-center border border-solid border-cyan-900 py-[8px] rounded-[8px]"
                >
                  Confirm Email
                </Button>
              </Column>
            </Row>
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

AccountConfirmation.PreviewProps = {
  confirmLink: 'https://react.email/confirm/123',
  expiryTime: '24 hours',
} satisfies AccountConfirmationProps;
