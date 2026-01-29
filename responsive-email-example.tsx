import {
  Body,
  Button,
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
  Text,
  Tailwind,
  pixelBasedPreset,
} from '@react-email/components';

interface ResponsiveEmailProps {
  companyName?: string;
  productName?: string;
  userFirstName?: string;
  heroImageUrl?: string;
  ctaLink?: string;
  discountPercentage?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://example.com';

export const ResponsiveEmail = ({
  companyName = 'TechCorp',
  productName = 'ProMax',
  userFirstName = 'Alex',
  heroImageUrl = `${baseUrl}/static/hero-image.png`,
  ctaLink = 'https://example.com/shop',
  discountPercentage = 20,
}: ResponsiveEmailProps) => {
  const previewText = `Exclusive ${discountPercentage}% off ${productName} - Limited Time Offer`;

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                primary: '#0066FF',
                secondary: '#FF6B35',
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-gray-50 px-2 font-sans">
          <Preview>{previewText}</Preview>

          {/* Main Container */}
          <Container className="mx-auto my-8 max-w-2xl rounded-lg bg-white shadow-lg">
            {/* Header Section - Responsive */}
            <Section className="bg-gradient-to-r from-primary to-blue-600 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
              <Heading className="m-0 text-center text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {companyName}
              </Heading>
              <Text className="m-0 mt-2 text-center text-sm text-blue-100 sm:text-base lg:text-lg">
                Exclusive Offer Just For You
              </Text>
            </Section>

            {/* Hero Image Section - Responsive */}
            <Section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
              <Img
                src={heroImageUrl}
                alt={`${productName} Hero Image`}
                className="w-full rounded-lg object-cover"
                width={600}
                height={300}
              />
            </Section>

            {/* Greeting Section */}
            <Section className="px-4 py-2 sm:px-6 lg:px-8">
              <Text className="m-0 text-lg font-semibold text-gray-900 sm:text-xl lg:text-2xl">
                Hi {userFirstName},
              </Text>
            </Section>

            {/* Content Section - Two Column Layout on Desktop */}
            <Section className="px-4 py-4 sm:px-6 lg:px-8">
              <Row>
                <Column className="w-full lg:w-1/2 lg:pr-4">
                  <Heading className="m-0 mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
                    Introducing {productName}
                  </Heading>
                  <Text className="m-0 mb-3 text-sm text-gray-700 leading-6 sm:text-base">
                    We're thrilled to present our latest innovation. {productName} is designed with cutting-edge technology to solve your everyday challenges.
                  </Text>
                </Column>

                <Column className="w-full pt-4 lg:w-1/2 lg:pt-0 lg:pl-4">
                  {/* Discount Badge - Responsive */}
                  <Section className="rounded-lg bg-secondary/10 px-4 py-6 text-center sm:px-6">
                    <Text className="m-0 text-sm font-semibold text-secondary sm:text-base">
                      LIMITED TIME OFFER
                    </Text>
                    <Heading className="m-0 mt-2 text-4xl font-bold text-secondary sm:text-5xl lg:text-6xl">
                      {discountPercentage}%
                    </Heading>
                    <Text className="m-0 mt-2 text-sm text-gray-700 sm:text-base">
                      Off Your First Purchase
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            {/* Features Section - Responsive Grid */}
            <Section className="px-4 py-6 sm:px-6 lg:px-8">
              <Heading className="m-0 mb-4 text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                Why Choose {productName}?
              </Heading>

              <Row>
                <Column className="mb-4 w-full text-center sm:mb-0 sm:w-1/3 sm:pr-3">
                  <Heading className="m-0 mb-2 text-base font-semibold text-primary sm:text-lg">
                    ⚡ Fast
                  </Heading>
                  <Text className="m-0 text-xs text-gray-600 sm:text-sm">
                    Lightning-quick performance
                  </Text>
                </Column>

                <Column className="mb-4 w-full text-center sm:mb-0 sm:w-1/3 sm:px-1.5">
                  <Heading className="m-0 mb-2 text-base font-semibold text-primary sm:text-lg">
                    🔒 Secure
                  </Heading>
                  <Text className="m-0 text-xs text-gray-600 sm:text-sm">
                    Bank-level encryption
                  </Text>
                </Column>

                <Column className="w-full text-center sm:w-1/3 sm:pl-3">
                  <Heading className="m-0 mb-2 text-base font-semibold text-primary sm:text-lg">
                    🎯 Reliable
                  </Heading>
                  <Text className="m-0 text-xs text-gray-600 sm:text-sm">
                    99.9% uptime guaranteed
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="mx-4 my-4 border-gray-200 sm:mx-6 lg:mx-8" />

            {/* Testimonial Section */}
            <Section className="bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
              <Text className="m-0 text-center text-sm italic text-gray-700 sm:text-base">
                "Since switching to {productName}, my productivity has increased by 300%. Highly recommended!"
              </Text>
              <Text className="m-0 mt-2 text-center text-xs font-semibold text-gray-900 sm:text-sm">
                - Sarah Johnson, CEO at StartupX
              </Text>
            </Section>

            {/* CTA Button Section - Responsive */}
            <Section className="px-4 py-8 text-center sm:px-6 sm:py-10 lg:px-8 lg:py-12">
              <Button
                href={ctaLink}
                className="inline-block rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white no-underline transition-all sm:px-8 sm:py-4 lg:px-10 lg:py-5 lg:text-lg"
              >
                Claim Your {discountPercentage}% Discount
              </Button>
              <Text className="m-0 mt-4 text-xs text-gray-600 sm:text-sm">
                Offer expires in 48 hours
              </Text>
            </Section>

            <Hr className="mx-4 my-4 border-gray-200 sm:mx-6 lg:mx-8" />

            {/* Footer Section - Responsive */}
            <Section className="px-4 py-8 sm:px-6 lg:px-8">
              <Row>
                <Column className="mb-4 w-full text-center sm:mb-0 sm:w-1/2 sm:text-left lg:text-left">
                  <Text className="m-0 text-xs font-semibold text-gray-900 sm:text-sm">
                    {companyName}
                  </Text>
                  <Text className="m-0 mt-1 text-xs text-gray-600 sm:text-sm">
                    support@{companyName.toLowerCase()}.com
                  </Text>
                </Column>

                <Column className="w-full text-center sm:w-1/2 sm:text-right">
                  <Link
                    href="https://example.com/unsubscribe"
                    className="text-xs text-primary no-underline sm:text-sm"
                  >
                    Unsubscribe
                  </Link>
                  <Text className="m-0 mx-2 inline text-xs text-gray-400 sm:text-sm">
                    |
                  </Text>
                  <Link
                    href="https://example.com/privacy"
                    className="text-xs text-primary no-underline sm:text-sm"
                  >
                    Privacy Policy
                  </Link>
                </Column>
              </Row>

              <Hr className="mx-0 my-4 border-gray-200 sm:my-6" />

              <Text className="m-0 text-center text-xs text-gray-500 sm:text-sm">
                © 2026 {companyName}. All rights reserved.
              </Text>
              <Text className="m-0 mt-2 text-center text-xs text-gray-500 sm:text-sm">
                123 Business Street, Suite 100 | New York, NY 10001
              </Text>
            </Section>
          </Container>

          {/* Spacer */}
          <Section className="h-4" />
        </Body>
      </Tailwind>
    </Html>
  );
};

// Preview props for development
ResponsiveEmail.PreviewProps = {
  companyName: 'TechCorp',
  productName: 'ProMax',
  userFirstName: 'Alex',
  heroImageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=300&fit=crop',
  ctaLink: 'https://example.com/shop',
  discountPercentage: 20,
} as ResponsiveEmailProps;

export default ResponsiveEmail;
