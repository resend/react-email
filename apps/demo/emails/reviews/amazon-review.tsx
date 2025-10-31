import {
  Body,
  Column,
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

interface AmazonReviewEmailProps {
  titleText?: string;
  reviewText?: string;
  reviwStars?: string[];
  socialMediaIcons?: string[];
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const AmazonReviewEmail = ({
  titleText = 'Your opinion is important!',
  reviewText = 'Alan Turing, do you have a moment? We would like to know if everything went well for you. Take a moment to review your most recent purchases.',
  reviwStars = Array(5).fill(`${baseUrl}/static/amazon-rating.gif`),
  socialMediaIcons = [
    `${baseUrl}/static/amazon-instagram.jpg`,
    `${baseUrl}/static/amazon-facebook.jpg`,
    `${baseUrl}/static/amazon-twitter.jpg`,
  ],
}: AmazonReviewEmailProps) => {
  return (
    <Html>
      <Head />

      <Tailwind config={tailwindConfig}>
        <Body className="font-amazon bg-white">
          <Preview>Amazon Review</Preview>
          <Container className="border-t-4 border-solid border-[#FF9900] mx-auto p-5 w-[640px]">
            <Section>
              <Row>
                <Column align="center">
                  <Link href="https://www.amazon.com">
                    <Img
                      src={`${baseUrl}/static/amazon-prime-logo.png`}
                      width="109"
                      height="48"
                      alt="Amazon Prime Logo"
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section>
              <Row>
                <Column align="center">
                  <Text className="text-[#232f3e] text-4xl leading-[38px] font-normal my-5">
                    {titleText}
                  </Text>
                  <Text>{reviewText}</Text>
                </Column>
              </Row>
            </Section>

            <Section>
              <Row>
                <Column>
                  <Img
                    src={`${baseUrl}/static/amazon-book.jpg`}
                    alt="Amazon Book"
                    width="274"
                    height="350"
                  />
                </Column>

                <Column className="pl-[30px]">
                  <Text>
                    14 Habits of Highly Productive Developers (English Edition)
                  </Text>
                  <Text>Start with rating this product</Text>

                  {reviwStars.map((star, index) => (
                    <Img
                      key={index}
                      src={star}
                      alt="Amazon Rating"
                      className="inline-block"
                    />
                  ))}

                  <Text>
                    Your reviews will be posted on Amazon using your public
                    name.
                    <Link>Check your public name.</Link>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section>
              <Row>
                <Column align="center">
                  <Text className="bg-[#008296] text-white py-2 px-0">
                    How about evaluating a previous purchase?{' '}
                    <Link className="text-white underline cursor-pointer">
                      View more
                    </Link>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-[#cccccc]" />

            <Section>
              <Row>
                <Column>
                  <Img
                    src={`${baseUrl}/static/amazon-logo.png`}
                    alt="Amazon Logo"
                    width="93"
                    height="23"
                  />
                </Column>

                <Column align="right">
                  {socialMediaIcons.map((src, index) => (
                    <Img
                      key={index}
                      src={src}
                      alt="Amazon Social Midia"
                      width="30"
                      height="30"
                      className="inline-block ml-2.5"
                    />
                  ))}
                </Column>
              </Row>
            </Section>

            <Section>
              <Row>
                <Text className="text-[10px] text-[#666666] my-2">
                  Customer reviews must adhere to the{' '}
                  <Link className="text-[#666666] underline cursor-pointer">
                    Community Guidelines
                  </Link>{' '}
                  .
                </Text>
                <Text className="text-[10px] text-[#666666] my-2">
                  We hope this message was helpful to you. However, if you
                  prefer not to receive this type of communication from{' '}
                  <Link className="text-[#1155cc] underline cursor-pointer">
                    Amazon.com
                  </Link>{' '}
                  at{' '}
                  <Link className="text-[#1155cc] underline cursor-pointer">
                    alanturing@gmail.com{' '}
                  </Link>
                  ,{' '}
                  <Link className="text-[#999999] underline cursor-pointer">
                    click here
                  </Link>{' '}
                  .
                </Text>
                <Text className="text-[10px] text-[#666666] my-2">
                  Please note that product prices and availability are subject
                  to change.
                </Text>
                <Text className="text-[10px] text-[#666666] my-2">
                  © 2023 Amazon.com, Inc. or its affiliates. Amazon and all
                  associated marks are trademarks of Amazon.com, Inc. or its
                  affiliates.
                </Text>
                <Text className="text-[10px] text-[#666666] my-2">
                  Reference: 706784740
                </Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AmazonReviewEmail.tailwindConfig = tailwindConfig;

export default AmazonReviewEmail;
