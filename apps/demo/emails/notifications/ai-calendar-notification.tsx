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

interface AiCalendarNotificationEmailProps {
  userFirstName?: string;
  eventTitle?: string;
  eventTime?: string;
  eventDate?: string;
  notificationType?: 'reminder' | 'update' | 'cancelled';
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const AiCalendarNotificationEmail = ({
  userFirstName = 'there',
  eventTitle = 'Upcoming Event',
  eventTime = '10:00 AM',
  eventDate = 'Today',
  notificationType = 'reminder',
}: AiCalendarNotificationEmailProps) => {
  const getNotificationMessage = () => {
    switch (notificationType) {
      case 'reminder':
        return `You have an upcoming event: "${eventTitle}" scheduled for ${eventDate} at ${eventTime}.`;
      case 'update':
        return `Your event "${eventTitle}" has been updated. It's now scheduled for ${eventDate} at ${eventTime}.`;
      case 'cancelled':
        return `Your event "${eventTitle}" originally scheduled for ${eventDate} at ${eventTime} has been cancelled.`;
      default:
        return '';
    }
  };

  const getSubjectLine = () => {
    switch (notificationType) {
      case 'reminder':
        return `Reminder: ${eventTitle}`;
      case 'update':
        return `Event Updated: ${eventTitle}`;
      case 'cancelled':
        return `Event Cancelled: ${eventTitle}`;
      default:
        return 'Calendar Notification';
    }
  };

  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] font-ai-calendar">
          <Preview>{getSubjectLine()}</Preview>
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
                {notificationType === 'reminder' && '📅 Event Reminder'}
                {notificationType === 'update' && '🔄 Event Updated'}
                {notificationType === 'cancelled' && '❌ Event Cancelled'}
              </Text>
              <Text className="text-[#737373] text-base leading-6 text-left">
                Hi {userFirstName},
              </Text>
              <Text className="text-[#737373] text-base leading-6 text-left">
                {getNotificationMessage()}
              </Text>
              <Section className="bg-[#fafafa] rounded-lg p-6 my-6 border border-solid border-[#e5e5e5]">
                <Text className="text-[#0a0a0b] text-[18px] font-semibold m-0 mb-2">
                  {eventTitle}
                </Text>
                <Text className="text-[#737373] text-[14px] m-0">
                  📆 {eventDate}
                </Text>
                <Text className="text-[#737373] text-[14px] m-0">
                  🕐 {eventTime}
                </Text>
              </Section>
              {notificationType !== 'cancelled' && (
                <Button
                  className="bg-[#f97316] rounded-lg text-white text-[16px] font-semibold no-underline text-center block py-3 px-6"
                  href="https://aicalendar.app/dashboard"
                >
                  View Event Details
                </Button>
              )}
              <Hr className="border-[#e5e5e5] my-6" />
              <Text className="text-[#737373] text-sm leading-6 text-left">
                You're receiving this notification because you have event
                reminders enabled. Manage your{' '}
                <Link
                  className="text-[#f97316]"
                  href="https://aicalendar.app/settings/notifications"
                >
                  notification preferences
                </Link>
                .
              </Text>
              <Text className="text-[#a3a3a3] text-xs leading-4 mt-6">
                AI Calendar Assistant, San Francisco, CA 94102
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AiCalendarNotificationEmail.PreviewProps = {
  userFirstName: 'Alex',
  eventTitle: 'Team Standup Meeting',
  eventTime: '10:00 AM',
  eventDate: 'Monday, January 20, 2025',
  notificationType: 'reminder',
} as AiCalendarNotificationEmailProps;

export default AiCalendarNotificationEmail;
