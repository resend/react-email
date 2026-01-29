import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import type { FC } from 'react';

interface WelcomeEmailProps {
  userName?: string;
  companyName?: string;
  dashboardUrl?: string;
  logoUrl?: string;
}

export const WelcomeEmail: FC<Readonly<WelcomeEmailProps>> = ({
  userName = 'there',
  companyName = 'Our Company',
  dashboardUrl = 'https://example.com/dashboard',
  logoUrl = 'https://your-domain.com/logo.png',
}) => {
  const previewText = `Welcome to ${companyName}!`;

  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Preview>{previewText}</Preview>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Img
              src={logoUrl}
              width="200"
              height="auto"
              alt={`${companyName} Logo`}
              style={logo}
            />
          </Section>

          {/* Welcome Section */}
          <Section style={contentSection}>
            <Heading style={h1}>Welcome to {companyName}!</Heading>

            <Text style={text}>
              Hi {userName},
            </Text>

            <Text style={text}>
              We're thrilled to have you on board! Your account has been created
              and is ready to use. Get started by exploring your dashboard and
              setting up your profile.
            </Text>

            <Text style={text}>
              Here's what you can do right now:
            </Text>

            {/* Features List */}
            <Section style={featuresSection}>
              <Row style={featureRow}>
                <Text style={featureText}>✓ Complete your profile</Text>
              </Row>
              <Row style={featureRow}>
                <Text style={featureText}>✓ Explore our features</Text>
              </Row>
              <Row style={featureRow}>
                <Text style={featureText}>✓ Connect your integrations</Text>
              </Row>
              <Row style={featureRow}>
                <Text style={featureText}>✓ Read our documentation</Text>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={button} href={dashboardUrl}>
                Go to Dashboard
              </Button>
            </Section>

            {/* Support Section */}
            <Text style={supportText}>
              Have questions? We're here to help! Contact our support team at{' '}
              <Link href="mailto:support@example.com" style={link}>
                support@example.com
              </Link>
              {' '}or visit our{' '}
              <Link href="https://example.com/help" style={link}>
                help center
              </Link>
              .
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © 2025 {companyName}. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href="https://example.com/privacy" style={footerLink}>
                Privacy Policy
              </Link>
              {' '} | {' '}
              <Link href="https://example.com/terms" style={footerLink}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

/* =====================
   Styling
   ===================== */

const main = {
  backgroundColor: '#f9fafb',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const logo = {
  display: 'block',
  margin: '0 auto',
  maxWidth: '200px',
  height: 'auto',
};

const contentSection = {
  padding: '0 20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  margin: '20px 0',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  lineHeight: '1.4',
  margin: '24px 0 16px',
  textAlign: 'center' as const,
};

const text = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const featuresSection = {
  padding: '20px 0',
  margin: '20px 0',
  borderTop: '1px solid #e5e7eb',
  borderBottom: '1px solid #e5e7eb',
};

const featureRow = {
  margin: '8px 0',
};

const featureText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const buttonSection = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  border: '1px solid #3b82f6',
};

const supportText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};

const footerSection = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const footerLink = {
  color: '#9ca3af',
  textDecoration: 'underline',
};
