import {
  Body,
  Button,
  Container,
  Head,
  Heading,
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
    <Preview>Choose the right plan for you</Preview>
    <Body>
      <Container
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          margin: '0 auto',
          maxWidth: '600px',
          padding: '24px',
        }}
      >
        <Section style={{ marginBottom: '42px' }}>
          <Heading
            style={{
              fontSize: '24px',
              lineHeight: '32px',
              marginBottom: '12px',
              textAlign: 'center',
            }}
          >
            Choose the right plan for you
          </Heading>
          <Text
            style={{
              color: '#6B7280',
              fontSize: '14px',
              lineHeight: '20px',
              margin: '0 auto',
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            Choose an affordable plan with top features to engage audiences,
            build loyalty, and boost sales.
          </Text>
        </Section>
        <Section
          style={{
            alignItems: 'flex-start',
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            paddingBottom: '24px',
          }}
        >
          {[
            {
              title: 'Hobby',
              price: 29,
              highlighted: false,
              description: 'The perfect plan for getting started.',
              features: [
                '25 products',
                'Up to 10,000 subscribers',
                'Advanced analytics',
                '24-hour support response time',
              ],
              buttonText: 'Get started today',
              buttonUrl: '#',
            },
            {
              title: 'Enterprise',
              price: 99,
              highlighted: true,
              description: 'Dedicated support and enterprise ready.',
              features: [
                'Unlimited products',
                'Unlimited subscribers',
                'Advanced analytics',
                'Dedicated support representative',
                'Marketing automations',
                'Custom integrations',
              ],
              buttonText: 'Get started today',
              buttonUrl: '#',
            },
          ].map((plan) => (
            <Section
              style={{
                backgroundColor: plan.highlighted ? '#101828' : '#FFFFFF',
                borderColor: plan.highlighted ? '#101828' : '#D1D5DB',
                borderRadius: '8px',
                borderStyle: 'solid',
                borderWidth: '1px',
                color: plan.highlighted ? '#d1d5dc' : '#4a5565',
                marginBottom: plan.highlighted ? '12px' : '24px',
                padding: '24px',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <Text
                style={{
                  color: plan.highlighted ? '#7c86ff' : '#4f46e5',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '20px',
                  margin: '0 0 16px 0',
                }}
              >
                {plan.title}
              </Text>
              <Text
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  marginTop: 0,
                }}
              >
                <span style={{ color: plan.highlighted ? '#ffff' : '#101828' }}>
                  ${plan.price}
                </span>{' '}
                <span style={{ fontSize: '14px', lineHeight: '20px' }}>
                  / month
                </span>
              </Text>
              <Text
                style={{
                  margin: '12px 0 24px 0',
                }}
              >
                {plan.description}
              </Text>
              <ul
                style={{
                  fontSize: '12px',
                  lineHeight: '20px',
                  marginBottom: '30px',
                  paddingLeft: '14px',
                }}
              >
                {plan.features.map((feature) => (
                  <li style={{ marginBottom: '8px' }}>{feature}</li>
                ))}
              </ul>
              <Button
                href={plan.buttonUrl}
                style={{
                  backgroundColor: '#4f46e5',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  color: '#fff',
                  display: 'inline-block',
                  fontWeight: '600',
                  margin: '0',
                  maxWidth: '100%',
                  padding: '12px',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {plan.buttonText}
              </Button>
            </Section>
          ))}
        </Section>
        <Hr style={{ marginTop: '0' }} />
        <Text
          style={{
            color: '#6b7280',
            fontSize: '12px',
            fontWeight: '500',
            margin: '30px 0 0 0',
            textAlign: 'center',
          }}
        >
          Customer Experience Research Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
