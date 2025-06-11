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

interface ForgotPasswordProps {
  resetLink: string;
  expiryTime: string;
}

export default function ForgotPassword({
  resetLink,
  expiryTime,
}: ForgotPasswordProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-black text-white">
          <Preview>Reset your React Email password</Preview>
          <Container className="mx-auto">
            <Heading className="font-bold text-center my-[48px] text-[32px]">
              Reset Your Password
            </Heading>
            <Text>
              We received a request to reset your password for your React Email
              account.
            </Text>
            <Text>
              Click the button below to create a new password. This link will
              expire in {expiryTime}.
            </Text>
            <Text className="mb-6">
              If you didn't request this, you can safely ignore this email.
            </Text>
            <Row className="w-full">
              <Column className="w-full">
                <Button
                  href={resetLink}
                  className="bg-cyan-300 text-[20px] font-bold text-[#404040] w-full text-center border border-solid border-cyan-900 py-[8px] rounded-[8px]"
                >
                  Reset Password
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

ForgotPassword.PreviewProps = {
  resetLink: 'https://react.email/reset-password/123',
  expiryTime: '1 hour',
} satisfies ForgotPasswordProps;
