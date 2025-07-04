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

interface FeedbackRequestProps {
  name: string;
}

export default function FeedbackRequest({ name }: FeedbackRequestProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-black text-white">
          <Preview>
            Thank you for using our service. We would love to hear your
            feedback.
          </Preview>
          <Container className="mx-auto">
            <Heading className="font-bold text-center my-[48px] text-[32px]">
              Hello {name},
            </Heading>
            <Text>
              Thank you for using our service. We would love to hear your
              thoughts and suggestions.
            </Text>
            <Text>
              We work hard to improve our service and your feedback is crucial
              for us to understand what we are doing well and where we can
              improve.
            </Text>
            <Text className="mb-6">
              If you have any questions about the service or need assistance,
              please feel free to reach out to us at{' '}
              <a
                href="mailto:support@react.email"
                className="text-cyan-300 underline"
              >
                support@react.email
              </a>
              .
            </Text>
            <Row className="w-full">
              <Column className="w-full">
                <Button
                  href="https://react.email"
                  className="bg-cyan-300 text-[20px] font-bold text-[#404040] w-full text-center border border-solid border-cyan-900 py-[8px] rounded-[8px]"
                >
                  Give Feedback
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

FeedbackRequest.PreviewProps = {
  name: 'user',
} satisfies FeedbackRequestProps;
