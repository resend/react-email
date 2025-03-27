import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Html>
    <Head />
    <Preview>
      Exclusive Offer Just For You: Unlock Premium Features at $12/month
    </Preview>
    <Body>
      <Container
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          margin: '0 auto',
          maxWidth: '500px',
          padding: '24px',
        }}
      >
        <Section
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#D1D5DB',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            color: '#4a5565',
            marginBottom: '0',
            padding: '28px',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <Text
            style={{
              color: '#4f46e5',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              lineHeight: '20px',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
            }}
          >
            Exclusive Offer
          </Text>
          <Text
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              lineHeight: '36px',
              marginBottom: '12px',
              marginTop: 0,
            }}
          >
            <span style={{ color: '#101828' }}>$12</span>{' '}
            <span
              style={{
                fontSize: '16px',
                fontWeight: '500',
                lineHeight: '20px',
              }}
            >
              / month
            </span>
          </Text>
          <Text
            style={{
              color: '#374151',
              fontSize: '14px',
              lineHeight: '20px',
              margin: '16px 0 24px 0',
            }}
          >
            We've handcrafted the perfect plan tailored specifically for your
            needs. Unlock premium features at an unbeatable value.
          </Text>
          <ul
            style={{
              color: '#6B7280',
              fontSize: '14px',
              lineHeight: '24px',
              marginBottom: '32px',
              paddingLeft: '14px',
            }}
          >
            {[
              'Manage up to 25 premium products',
              'Grow your audience with 10,000 subscribers',
              'Make data-driven decisions with advanced analytics',
              'Priority support with 24-hour response time',
              'Seamless integration with your favorite tools',
            ].map((feature) => (
              <li style={{ marginBottom: '12px', position: 'relative' }}>
                <span style={{ position: 'relative' }}>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            href="#"
            style={{
              backgroundColor: '#4f46e5',
              borderRadius: '8px',
              boxSizing: 'border-box',
              color: '#fff',
              display: 'inline-block',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '0.025em',
              margin: '0 0 24px 0',
              maxWidth: '100%',
              padding: '14px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            Claim Your Special Offer
          </Button>
          <Hr />
          <Text
            style={{
              color: '#6B7280',
              fontSize: '12px',
              fontStyle: 'italic',
              margin: '24px 0 6px 0',
              textAlign: 'center',
            }}
          >
            Limited time offer - Upgrade now and save 20%
          </Text>
          <Text
            style={{
              color: '#6B7280',
              fontSize: '12px',
              margin: '0',
              textAlign: 'center',
            }}
          >
            No credit card required. 14-day free trial available.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
