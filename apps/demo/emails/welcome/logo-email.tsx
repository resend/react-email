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

interface LogoEmailProps {
  recipientName?: string;
  companyName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const LogoEmail = ({
  recipientName = 'User',
  companyName = 'Acme Corp',
}: LogoEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-[#f6f9fc] font-sans">
        <Preview>
          Welcome to {companyName}! We're excited to have you on board.
        </Preview>
        <Container className="bg-white mx-auto py-5 pb-12 mb-16 max-w-[480px]">
          <Section className="px-12 py-5">
            <Img
              src={`${baseUrl}/static/company-logo.png`}
              width="120"
              height="40"
              alt={companyName}
              className="mb-4"
            />
            <Hr className="border-[#e6ebf1] my-5" />
            <Text className="text-[#525f7f] text-base leading-6 text-left font-medium mb-4">
              Welcome, {recipientName}!
            </Text>
            <Text className="text-[#525f7f] text-base leading-6 text-left mb-4">
              We're thrilled to have you join {companyName}. Whether you're here
              to explore our products, collaborate with your team, or build
              something amazing, we're here to support you every step of the way.
            </Text>
            <Text className="text-[#525f7f] text-base leading-6 text-left mb-6">
              Here's what you can do next:
            </Text>
            <Section className="bg-[#f9fafb] p-6 rounded-lg mb-6">
              <Text className="text-[#525f7f] text-base leading-6 mb-3">
                ✓ Complete your profile to personalize your experience
              </Text>
              <Text className="text-[#525f7f] text-base leading-6 mb-3">
                ✓ Explore our documentation and resources
              </Text>
              <Text className="text-[#525f7f] text-base leading-6">
                ✓ Connect with our community of users
              </Text>
            </Section>
            <Button
              className="bg-[#656ee8] rounded-lg text-white text-[16px] font-bold no-underline text-center block w-full py-3 px-6"
              href={`${baseUrl}`}
            >
              Get Started
            </Button>
            <Hr className="border-[#e6ebf1] my-5" />
            <Text className="text-[#525f7f] text-base leading-6 text-left mb-4">
              Need help? Check out our{' '}
              <Link
                className="text-[#656ee8] font-bold no-underline"
                href={`${baseUrl}/help`}
              >
                help center
              </Link>{' '}
              or{' '}
              <Link
                className="text-[#656ee8] font-bold no-underline"
                href={`${baseUrl}/contact`}
              >
                contact support
              </Link>
              .
            </Text>
            <Text className="text-[#8898aa] text-xs leading-4 text-left">
              {companyName}, Inc. ・ 123 Main Street ・ San Francisco, CA 94107
            </Text>
            <Text className="text-[#8898aa] text-xs leading-4 text-left">
              © 2024 {companyName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

LogoEmail.PreviewProps = {
  recipientName: 'Jane Smith',
  companyName: 'Acme Corp',
} as LogoEmailProps;

export default LogoEmail;
