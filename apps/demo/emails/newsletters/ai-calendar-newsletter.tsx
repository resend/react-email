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

interface AICalendarNewsletterEmailProps {
  features?: { id: number; title: string; description: string }[];
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const PropDefaults: AICalendarNewsletterEmailProps = {
  features: [
    {
      id: 1,
      title: 'Voice Commands',
      description:
        'Now you can manage your calendar entirely hands-free. Just say "Hey Calendar, schedule a meeting..."',
    },
    {
      id: 2,
      title: 'Smart Scheduling',
      description:
        'Our AI now analyzes your productivity patterns to suggest optimal meeting times.',
    },
    {
      id: 3,
      title: 'Analytics Dashboard',
      description:
        'Get insights into how you spend your time with beautiful, interactive charts.',
    },
  ],
};

export const AICalendarNewsletterEmail = ({
  features = [],
}: AICalendarNewsletterEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-[#f6f9fc] font-ai-calendar">
        <Preview>What's new in AI Calendar Assistant</Preview>
        <Container className="w-[680px] max-w-full mx-auto bg-white">
          <Section className="flex bg-[#f6f9fc] p-5 px-[30px]">
            <Img
              width={48}
              height={48}
              src={`${baseUrl}/static/ai-calendar-logo.png`}
              alt="AI Calendar Assistant"
            />
          </Section>

          <Section className="rounded-t-md flex flex-col bg-[#f97316]">
            <Row>
              <Column className="py-5 px-[30px] pb-[15px]">
                <Heading className="text-white text-[27px] leading-[27px] font-bold">
                  Your Monthly Update
                </Heading>
                <Text className="text-white text-[17px] leading-[24px]">
                  New features to supercharge your productivity
                </Text>
              </Column>
              <Column className="py-[30px] px-[10px]">
                <Img
                  className="max-w-full"
                  width={280}
                  src={`${baseUrl}/static/ai-calendar-header.png`}
                  alt="Calendar illustration"
                />
              </Column>
            </Row>
          </Section>

          <Section className="pt-[30px] px-[30px] pb-10">
            <Heading
              as="h2"
              className="mb-[15px] mt-0 font-bold text-[21px] leading-none text-[#0a0a0b]"
            >
              What&apos;s New This Month
            </Heading>
            <Text className="text-[15px] leading-[21px] text-[#737373]">
              We&apos;ve been working hard to make your scheduling experience
              even better. Here&apos;s what we&apos;ve shipped:
            </Text>

            <Hr className="my-[30px] border-[#e5e5e5]" />

            {features.map((feature) => (
              <Section key={feature.id} className="mb-6">
                <Heading
                  as="h3"
                  className="mb-2 font-semibold text-[18px] leading-none text-[#0a0a0b]"
                >
                  ✨ {feature.title}
                </Heading>
                <Text className="text-[15px] leading-[21px] text-[#737373] m-0">
                  {feature.description}
                </Text>
              </Section>
            ))}

            <Hr className="my-[30px] border-[#e5e5e5]" />

            <Heading
              as="h2"
              className="mb-4 font-bold text-[21px] leading-none text-[#0a0a0b]"
            >
              Pro Tip of the Month
            </Heading>
            <Text className="text-[15px] leading-[21px] text-[#737373]">
              Did you know you can use natural language like &quot;Move my 3pm
              meeting to tomorrow&quot;? Our AI understands context and can
              reschedule events intelligently!
            </Text>

            <Section className="mt-6 block">
              <Link
                className="bg-[#f97316] border border-solid border-[#e1430d] text-[17px] leading-[17px] py-[13px] px-[17px] rounded-lg text-white no-underline"
                href="https://aicalendar.app/dashboard"
              >
                Try it now
              </Link>
            </Section>
          </Section>
        </Container>

        <Section className="w-[680px] max-w-full mt-8 mx-auto py-0 px-[30px]">
          <Text className="text-xs leading-[15px] text-[#a3a3a3] m-0">
            You&apos;re receiving this because you subscribed to AI Calendar
            Assistant updates.
          </Text>

          <Link
            href="https://aicalendar.app/unsubscribe"
            className="inline-block text-[#a3a3a3] underline text-[12px] mr-[10px] mb-0 mt-2"
          >
            Unsubscribe
          </Link>
          <Link
            href="https://aicalendar.app/settings/notifications"
            className="inline-block text-[#a3a3a3] underline text-[12px] mr-[10px] mb-0 mt-2"
          >
            Email preferences
          </Link>
          <Link
            href="https://aicalendar.app/support"
            className="inline-block text-[#a3a3a3] underline text-[12px] mr-[10px] mb-0 mt-2"
          >
            Contact us
          </Link>
          <Link
            href="https://aicalendar.app/privacy"
            className="inline-block text-[#a3a3a3] underline text-[12px] mr-[10px] mb-0 mt-2"
          >
            Privacy
          </Link>

          <Hr className="my-[30px] border-[#e5e5e5]" />

          <Img
            width={32}
            height={32}
            src={`${baseUrl}/static/ai-calendar-logo.png`}
            alt="AI Calendar Assistant"
          />
          <Text className="my-1 text-[12px] leading-[15px] text-[#a3a3a3]">
            <strong>AI Calendar Assistant</strong>, San Francisco, CA 94102
          </Text>
          <Text className="rounded-lg border border-solid border-[#e5e5e5] pt-1 pb-[3px] px-[6px] text-[11px] leading-none text-[#f97316] max-w-min m-0 mb-8">
            {'<3'}
          </Text>
        </Section>
      </Body>
    </Tailwind>
  </Html>
);

AICalendarNewsletterEmail.PreviewProps = {
  features: PropDefaults.features,
} as AICalendarNewsletterEmailProps;

export default AICalendarNewsletterEmail;
