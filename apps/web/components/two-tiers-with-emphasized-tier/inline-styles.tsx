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
          backgroundColor: 'rgb(255,255,255)',
          borderRadius: '8px',
          marginLeft: 'auto',
          marginRight: 'auto',
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
              color: 'rgb(107,114,128)',
              fontSize: '14px',
              lineHeight: '20px',
              marginLeft: 'auto',
              marginRight: 'auto',
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
                backgroundColor: plan.highlighted
                  ? 'rgb(16,24,40)'
                  : 'rgb(255,255,255)',
                borderColor: plan.highlighted
                  ? 'rgb(16,24,40)'
                  : 'rgb(209,213,219)',
                borderRadius: '8px',
                borderStyle: 'solid',
                borderWidth: '1px',
                color: plan.highlighted ? 'rgb(209,213,219)' : 'rgb(75,85,99)',
                marginBottom: plan.highlighted ? '12px' : '24px',
                padding: '24px',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <Text
                style={{
                  color: plan.highlighted
                    ? 'rgb(124,134,255)'
                    : 'rgb(79,70,229)',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '20px',
                  marginBottom: '16px',
                }}
              >
                {plan.title}
              </Text>
              <Text
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  marginTop: '0px',
                }}
              >
                <span
                  style={{
                    color: plan.highlighted
                      ? 'rgb(255,255,255)'
                      : 'rgb(16,24,40)',
                  }}
                >
                  ${plan.price}
                </span>{' '}
                <span style={{ fontSize: '14px', lineHeight: '20px' }}>
                  / month
                </span>
              </Text>
              <Text
                style={{
                  marginTop: '12px',
                  marginBottom: '24px',
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
                  <li key={feature} style={{ marginBottom: '8px' }}>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                href={plan.buttonUrl}
                style={{
                  backgroundColor: 'rgb(79,70,229)',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  color: 'rgb(255,255,255)',
                  display: 'inline-block',
                  fontWeight: '600',
                  margin: '0px',
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
        <Hr style={{ marginTop: '0px' }} />
        <Text
          style={{
            color: 'rgb(107,114,128)',
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: '500',
            marginTop: '30px',
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
