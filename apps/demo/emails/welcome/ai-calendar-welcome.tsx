import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface AiCalendarWelcomeEmailProps {
  userFirstName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const AiCalendarWelcomeEmail = ({
  userFirstName = 'there',
}: AiCalendarWelcomeEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-[#f6f9fc] font-ai-calendar">
        <Preview>
          Welcome to AI Calendar Assistant - Your smart scheduling companion
        </Preview>
        <Container className="bg-white mx-auto py-5 pb-12 mb-16">
          <Section className="px-12">
            <Img
              src={`${baseUrl}/static/ai-calendar-logo.png`}
              width="48"
              height="48"
              alt="AI Calendar Assistant"
            />
            <Hr className="border-[#e5e5e5] my-5" />
            <Text className="text-[#0a0a0b] text-[24px] font-semibold leading-8 text-left">
              Welcome to AI Calendar Assistant, {userFirstName}!
            </Text>
            <Text className="text-[#737373] text-base leading-6 text-left">
              We're thrilled to have you on board. AI Calendar Assistant is your
              intelligent scheduling companion that helps you manage your time
              effortlessly using natural language.
            </Text>
            <Text className="text-[#737373] text-base leading-6 text-left">
              Here's what you can do with your new AI-powered calendar:
            </Text>
            <Text className="text-[#0a0a0b] text-base leading-6 text-left pl-4">
              • <strong>Talk naturally</strong> - Just say "Schedule a meeting
              with John tomorrow at 3pm"
            </Text>
            <Text className="text-[#0a0a0b] text-base leading-6 text-left pl-4">
              • <strong>Smart insights</strong> - Get analytics on how you spend
              your time
            </Text>
            <Text className="text-[#0a0a0b] text-base leading-6 text-left pl-4">
              • <strong>Voice control</strong> - Manage your calendar hands-free
            </Text>
            <Button
              className="bg-[#f97316] rounded-lg text-white text-[16px] font-semibold no-underline text-center block py-3 px-6 mt-6"
              href="https://aicalendar.app/dashboard"
            >
              Go to Dashboard
            </Button>
            <Hr className="border-[#e5e5e5] my-6" />
            <Text className="text-[#737373] text-base leading-6 text-left">
              Need help getting started? Check out our{' '}
              <Link
                className="text-[#f97316]"
                href="https://aicalendar.app/docs"
              >
                documentation
              </Link>{' '}
              or reach out to our{' '}
              <Link
                className="text-[#f97316]"
                href="https://aicalendar.app/support"
              >
                support team
              </Link>
              .
            </Text>
            <Text className="text-[#737373] text-base leading-6 text-left">
              — The AI Calendar Assistant Team
            </Text>
            <Hr className="border-[#e5e5e5] my-5" />
            <Text className="text-[#a3a3a3] text-xs leading-4">
              AI Calendar Assistant, San Francisco, CA 94102
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

AiCalendarWelcomeEmail.PreviewProps = {
  userFirstName: 'Alex',
} as AiCalendarWelcomeEmailProps;

export default AiCalendarWelcomeEmail;
