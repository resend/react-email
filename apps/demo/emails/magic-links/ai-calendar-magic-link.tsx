import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface AICalendarMagicLinkEmailProps {
  loginCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const AICalendarMagicLinkEmail = ({
  loginCode,
}: AICalendarMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white font-ai-calendar">
        <Preview>Your AI Calendar Assistant login code</Preview>
        <Container className="px-3 mx-auto">
          <Img
            src={`${baseUrl}/static/ai-calendar-logo.png`}
            width="48"
            height="48"
            alt="AI Calendar Assistant"
            className="mt-8"
          />
          <Heading className="text-[#0a0a0b] text-[24px] my-8 mx-0 p-0">
            Sign in to AI Calendar Assistant
          </Heading>
          <Link
            href="https://aicalendar.app/auth/verify"
            target="_blank"
            className="text-[#f97316] text-[14px] underline mb-4 block"
          >
            Click here to sign in with this magic link
          </Link>
          <Text className="text-[#0a0a0b] text-[14px] my-6 mb-3.5">
            Or, copy and paste this verification code:
          </Text>
          <code className="inline-block py-4 px-[4.5%] w-9/10 bg-[#fafafa] rounded-lg border border-solid border-[#e5e5e5] text-[#0a0a0b] text-[32px] font-semibold tracking-[0.25em] text-center">
            {loginCode}
          </code>
          <Text className="text-[#737373] text-[14px] mt-6 mb-4">
            This code will expire in 10 minutes.
          </Text>
          <Text className="text-[#a3a3a3] text-[14px] mt-3.5 mb-9.5">
            If you didn&apos;t request this code, you can safely ignore this
            email. Someone may have entered your email address by mistake.
          </Text>
          <Img
            src={`${baseUrl}/static/ai-calendar-logo.png`}
            width="32"
            height="32"
            alt="AI Calendar Assistant Logo"
          />
          <Text className="text-[#a3a3a3] text-[12px] leading-[22px] mt-3 mb-6">
            <Link
              href="https://aicalendar.app"
              target="_blank"
              className="text-[#a3a3a3] text-[14px] underline"
            >
              AI Calendar Assistant
            </Link>
            , your intelligent scheduling companion
            <br />
            powered by AI for effortless time management.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

AICalendarMagicLinkEmail.PreviewProps = {
  loginCode: '847293',
} as AICalendarMagicLinkEmailProps;

export default AICalendarMagicLinkEmail;
