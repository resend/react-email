import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Html>
    <Head />
    <Preview>Top 5 Features of Our Service</Preview>
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
        <Heading
          style={{
            fontSize: '24px',
            lineHeight: '32px',
            marginBottom: '42px',
            textAlign: 'center',
          }}
        >
          Top 5 Features of Our Service
        </Heading>
        {[
          {
            number: 1,
            title: 'Innovative Solutions',
            description:
              'We deliver innovative solutions that drive success and growth.',
          },
          {
            number: 2,
            title: 'Exceptional Performance',
            description:
              'Our services deliver high-quality performance and efficiency.',
          },
          {
            number: 3,
            title: 'Reliable Support',
            description:
              'We have robust support to keep your operations running smoothly.',
          },
          {
            number: 4,
            title: 'Advanced Security',
            description:
              'We implement cutting-edge security measures to protect your data and assets.',
          },
          {
            number: 5,
            title: 'Scalable Growth',
            description:
              'We develop customized strategies for sustainable and scalable growth.',
          },
        ].map((feature) => (
          <Section
            style={{
              marginBottom: '36px',
            }}
          >
            <div
              style={{
                alignItems: 'flex-start',
                display: 'inline-flex',
                marginLeft: '12px',
                marginRight: '32px',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  backgroundColor: 'rgb(79,70,229)',
                  borderRadius: '9999px',
                  color: 'rgb(255,255,255)',
                  display: 'flex',
                  flexShrink: '0',
                  fontSize: '12px',
                  fontWeight: '600',
                  height: '24px',
                  justifyContent: 'center',
                  lineHeight: '1',
                  marginRight: '18px',
                  width: '24px',
                }}
              >
                {feature.number}
              </div>
              <div>
                <Heading
                  as="h2"
                  style={{
                    color: 'rgb(17,24,39)',
                    fontSize: '18px',
                    lineHeight: '28px',
                    marginBottom: '8px',
                    marginTop: '0px',
                  }}
                >
                  {feature.title}
                </Heading>
                <Text
                  style={{
                    color: 'rgb(107,114,128)',
                    fontSize: '14px',
                    lineHeight: '24px',
                    margin: '0px',
                  }}
                >
                  {feature.description}
                </Text>
              </div>
            </div>
          </Section>
        ))}
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
