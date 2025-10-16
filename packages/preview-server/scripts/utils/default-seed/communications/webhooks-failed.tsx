import {
  Body,
  CodeBlock,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
  vesper,
} from '@react-email/components';

interface WebhooksFailedProps {
  date: string;
  error: {
    error: string;
    timestamp: string;
    webhookId: string;
    details: {
      reason: string;
      retryCount: number;
      lastAttempt: string;
    };
  };
}

export default function WebhooksFailed({ date, error }: WebhooksFailedProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-black text-white">
          <Preview>Some webhooks failed to deliver at {date}</Preview>
          <Container className="mx-auto">
            <Heading className="font-bold text-center text-[32px]">
              Failed webhook attempt
            </Heading>
            <Text>
              We encountered an issue with some of our webhooks. Please check
              the logs for more details. Here is the data for the error:
            </Text>
            <CodeBlock
              code={JSON.stringify(error, null, 2)}
              language="json"
              theme={vesper}
              style={{
                padding: '16px',
                borderRadius: '8px',
              }}
              lineNumbers
            />
            <Text className="mb-6">
              If you have any questions or need assistance, please reach out to
              us at{' '}
              <a
                href="mailto:support@react.email"
                className="text-cyan-300 underline"
              >
                support@react.email
              </a>
              .
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

WebhooksFailed.PreviewProps = {
  date: 'June 4th, 202',
  error: {
    error: 'Webhook delivery failed',
    timestamp: '2023-10-01T12:00:00Z',
    webhookId: 'wh_1234567890',
    details: {
      reason: 'Network error',
      retryCount: 3,
      lastAttempt: '2023-10-01T12:05:00Z',
    },
  },
} satisfies WebhooksFailedProps;
