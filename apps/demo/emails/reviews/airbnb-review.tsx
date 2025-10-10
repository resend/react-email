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
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface AirbnbReviewEmailProps {
  authorName?: string;
  authorImage?: string;
  reviewText?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const AirbnbReviewEmail = ({
  authorName,
  authorImage,
  reviewText,
}: AirbnbReviewEmailProps) => {
  const previewText = `Read ${authorName}'s review`;

  return (
    <Html>
      <Head />

      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-airbnb">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto py-5 pb-12 w-[580px] max-w-full">
            <Section>
              <Img
                src={`${baseUrl}/static/airbnb-logo.png`}
                width="96"
                height="30"
                alt="Airbnb"
              />
            </Section>
            <Section>
              <Img
                src={authorImage}
                width="96"
                height="96"
                alt={authorName}
                className="mx-auto mb-4 rounded-full"
              />
            </Section>
            <Section className="pb-5">
              <Row>
                <Text className="text-[32px] leading-[1.3] font-bold text-[#484848]">
                  Here's what {authorName} wrote
                </Text>
                <Text className="text-lg leading-[1.4] text-[#484848] p-6 bg-[#f2f3f3] rounded">
                  {reviewText}
                </Text>
                <Text className="text-lg leading-[1.4] text-[#484848]">
                  Now that the review period is over, we've posted {authorName}
                  's review to your Airbnb profile.
                </Text>
                <Text className="text-lg leading-[1.4] text-[#484848] pb-4">
                  While it's too late to write a review of your own, you can
                  send your feedback to {authorName} using your Airbnb message
                  thread.
                </Text>

                <Button
                  className="bg-[#ff5a5f] rounded-sm text-white text-[18px] py-[19px] px-[30px] no-underline text-center block"
                  href="https://www.airbnb.com"
                >
                  Send My Feedback
                </Button>
              </Row>
            </Section>

            <Hr className="border-[#cccccc] my-5" />

            <Section>
              <Row>
                <Text className="text-lg leading-[1.4] text-[#484848] font-bold">
                  Common questions
                </Text>
                <Text>
                  <Link
                    href="https://www.airbnb.com"
                    className="text-lg leading-[1.4] text-[#ff5a5f] block"
                  >
                    How do reviews work?
                  </Link>
                </Text>
                <Text>
                  <Link
                    href="https://www.airbnb.com"
                    className="text-lg leading-[1.4] text-[#ff5a5f] block"
                  >
                    How do star ratings work?
                  </Link>
                </Text>
                <Text>
                  <Link
                    href="https://www.airbnb.com"
                    className="text-lg leading-[1.4] text-[#ff5a5f] block"
                  >
                    Can I leave a review after 14 days?
                  </Link>
                </Text>
                <Hr className="border-[#cccccc] my-5" />
                <Text className="text-[#9ca299] text-[14px] leading-[24px] mb-2.5">
                  Airbnb, Inc., 888 Brannan St, San Francisco, CA 94103
                </Text>
                <Link
                  href="https://www.airbnb.com"
                  className="text-[14px] text-[#9ca299] underline"
                >
                  Report unsafe behavior
                </Link>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AirbnbReviewEmail.PreviewProps = {
  authorName: 'Alex',
  authorImage: `${baseUrl}/static/airbnb-review-user.jpg`,
  reviewText: `“Alan was a great guest! Easy communication, the apartment was left
    in great condition, very polite, and respectful of all house rules.
    He’s welcome back anytime and would easily recommend him to any
    host!”`,
} as AirbnbReviewEmailProps;

AirbnbReviewEmail.tailwindConfig = tailwindConfig;

export default AirbnbReviewEmail;
