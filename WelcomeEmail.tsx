import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  pixelBasedPreset,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  username: string;
  verificationUrl: string;
}

export const WelcomeEmail = ({
  username,
  verificationUrl,
}: WelcomeEmailProps) => {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: '#007bff',
                brandDark: '#0056b3',
              },
            },
          },
        }}
      >
        <Head>
          <meta name="author" content="React Email Team" />
          <meta name="description" content="Welcome to our platform - please verify your email address" />
          <meta name="keywords" content="welcome, verification, onboarding, email" />
          <meta property="og:title" content="Welcome - Verify Your Email" />
          <meta property="og:description" content="Thanks for signing up! Please verify your email to get started." />
          <meta name="x-priority" content="1" />
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta name="format-detection" content="telephone=no,address=no,email=no,date=no" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Preview>Welcome to our platform! Let's get you started.</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="mx-auto px-4 max-w-xl bg-white rounded">
            <Section className="bg-brand rounded-t-lg p-8 text-center">
              <Heading className="text-white text-3xl font-bold m-0">
                Welcome, {username}!
              </Heading>
            </Section>

            <Section className="px-8 py-6">
              <Text className="text-gray-700 text-base leading-6 mb-4">
                We're thrilled to have you on board. Your account has been successfully created, and you're now ready to explore everything we have to offer.
              </Text>

              <Text className="text-gray-700 text-base leading-6 mb-4">
                First, please verify your email address by clicking the button below:
              </Text>

              <Section className="text-center my-6">
                <Button
                  href={verificationUrl}
                  className="bg-brand text-white px-8 py-3 rounded font-semibold no-underline box-border"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-gray-700 text-base leading-6 mb-4">
                Here are a few things you can do after verification:
              </Text>

              <Section className="bg-gray-50 rounded-lg p-6 mb-4 border-solid border border-gray-200">
                <Text className="font-semibold text-gray-800 mb-2">
                  1. Complete your profile
                </Text>
                <Text className="text-gray-600 text-sm m-0">
                  Add more details to personalize your experience
                </Text>
              </Section>

              <Section className="bg-gray-50 rounded-lg p-6 mb-4 border-solid border border-gray-200">
                <Text className="font-semibold text-gray-800 mb-2">
                  2. Explore our features
                </Text>
                <Text className="text-gray-600 text-sm m-0">
                  Discover all the tools available to you
                </Text>
              </Section>

              <Section className="bg-gray-50 rounded-lg p-6 mb-6 border-solid border border-gray-200">
                <Text className="font-semibold text-gray-800 mb-2">
                  3. Connect with the community
                </Text>
                <Text className="text-gray-600 text-sm m-0">
                  Join discussions and meet other members
                </Text>
              </Section>

              <Text className="text-gray-600 text-sm text-center">
                If you have any questions, feel free to{' '}
                <Link href="https://example.com/support" className="text-brand underline">
                  contact our support team
                </Link>
                .
              </Text>

              <Text className="text-gray-500 text-sm text-center mt-4">
                If you didn't create an account, you can safely ignore this email.
              </Text>
            </Section>

            <Section className="text-center mt-8 px-8 pb-6">
              <Text className="text-gray-500 text-xs m-0">
                You're receiving this email because you created an account.
              </Text>
              <Text className="text-gray-500 text-xs m-0">
                123 Main Street, City, State 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// Preview props for testing
WelcomeEmail.PreviewProps = {
  username: 'John Doe',
  verificationUrl: 'https://example.com/verify/abc123',
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
