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

const features = [
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
];

const FeatureSection = ({ number, title, description }) => (
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
        marginRight: '30px',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#007BFF',
          borderRadius: '100%',
          color: '#ffffff',
          display: 'flex',
          fontSize: '12px',
          fontWeight: '600',
          height: '24px',
          justifyContent: 'center',
          marginRight: '18px',
          width: '24px',
        }}
      >
        {number}
      </div>
      <div>
        <Heading
          as="h2"
          style={{
            fontSize: '18px',
            marginBottom: '8px',
            marginTop: '0',
          }}
        >
          {title}
        </Heading>
        <Text
          style={{
            fontSize: '14px',
            lineHeight: '20px',
            margin: '0',
          }}
        >
          {description}
        </Text>
      </div>
    </div>
  </Section>
);

export const component = (
  <Html>
    <Head />
    <Preview>Top 5 Features of Our Service</Preview>
    <Body
      style={{
        backgroundColor: '#f9f9f9',
        margin: '0',
        padding: '24px',
      }}
    >
      <Container
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          margin: '0 auto',
          maxWidth: '600px',
          padding: '24px',
        }}
      >
        <Heading
          style={{
            fontSize: '24px',
            marginBottom: '42px',
            textAlign: 'center',
          }}
        >
          Top 5 Features of Our Service
        </Heading>
        {features.map((feature) => (
          <FeatureSection
            key={feature.number}
            number={feature.number}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
