import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface AICalendarResetPasswordEmailProps {
  userFirstName?: string;
  resetPasswordLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const AICalendarResetPasswordEmail = ({
  userFirstName,
  resetPasswordLink,
}: AICalendarResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] py-2.5 font-ai-calendar">
          <Preview>Reset your AI Calendar Assistant password</Preview>
          <Container className="bg-white border border-solid border-[#e5e5e5] p-[45px]">
            <Img
              src={`${baseUrl}/static/ai-calendar-logo.png`}
              width="48"
              height="48"
              alt="AI Calendar Assistant"
            />
            <Section>
              <Text className="text-base text-[#0a0a0b] leading-[26px] mt-6">
                Hi {userFirstName},
              </Text>
              <Text className="text-base text-[#737373] leading-[26px]">
                We received a request to reset the password for your AI Calendar
                Assistant account. Click the button below to set a new password:
              </Text>
              <Button
                className="bg-[#f97316] rounded-lg text-white text-[15px] font-semibold no-underline text-center block w-[210px] py-[14px] px-[7px]"
                href={resetPasswordLink}
              >
                Reset Password
              </Button>
              <Text className="text-base text-[#737373] leading-[26px]">
                This link will expire in 1 hour for security reasons.
              </Text>
              <Text className="text-base text-[#737373] leading-[26px]">
                If you didn&apos;t request this password reset, you can safely
                ignore this email. Your password will remain unchanged.
              </Text>
              <Text className="text-base text-[#737373] leading-[26px]">
                For security tips, visit our{' '}
                <Link
                  className="text-[#f97316] underline"
                  href="https://aicalendar.app/security"
                >
                  security center
                </Link>
                .
              </Text>
              <Text className="text-base text-[#737373] leading-[26px]">
                Stay organized,
                <br />
                The AI Calendar Assistant Team
              </Text>
            </Section>
          </Container>
          <Text className="text-[#a3a3a3] text-xs text-center mt-6">
            AI Calendar Assistant, San Francisco, CA 94102
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

AICalendarResetPasswordEmail.PreviewProps = {
  userFirstName: 'Alex',
  resetPasswordLink: 'https://aicalendar.app/reset-password?token=abc123',
} as AICalendarResetPasswordEmailProps;

export default AICalendarResetPasswordEmail;
