import {
  Html,
  Head,
  Body,
  Tailwind,
  Button,
  Text,
  Heading,
  Container,
  Preview,
  Row,
  Column,
} from "@react-email/components";

interface FeedbackRequestProps {
  name: string;
}

export default function FeedbackRequest({ name }: FeedbackRequestProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100">
          <Preview>
            Thank you for using our service. We would love to hear your
            feedback.
          </Preview>
          <Container>
            <Heading className="text-[24px] leading-[32px] font-bold mb-4">
              We Value Your Feedback {name}!
            </Heading>
            <Text>
              Thank you for using our service. We would love to hear your
              thoughts and suggestions.
            </Text>
            <Row>
              <Column align="center">
                <Button
                  href="https://react.email"
                  className="bg-blue-500 text-white w-fit border border-solid border-gray-100 px-[16px] py-[8px] rounded-[4px]"
                >
                  Give Feedback
                </Button>
              </Column>
            </Row>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

FeedbackRequest.PreviewProps = {
  name: "React Emailer",
} satisfies FeedbackRequestProps;
