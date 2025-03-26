import {
  Body,
  Column,
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
import { Layout } from '../_components/layout';

const steps = [
  {
    number: 1,
    imageUrl: '/static/stagg-eletric-kettle.jpg',
    title: 'Start Your Search',
    description:
      'Search for the products you need or upload your list of requirements.',
    learnMoreLink: 'https://your-site.com/learn-more/step1',
  },
  {
    number: 2,
    imageUrl: '/static/atmos-vacuum-canister.jpg',
    title: 'Compare & Save',
    description:
      'Compare prices and offers from different suppliers to find the best deals.',
    learnMoreLink: 'https://your-site.com/learn-more/step2',
  },
  {
    number: 3,
    imageUrl: '/static/bundle-collection.jpg',
    title: 'Build Your Cart',
    description:
      'Select your desired items and add them to your shopping cart.',
    learnMoreLink: 'https://your-site.com/learn-more/step3',
  },
  {
    number: 4,
    imageUrl: '/static/clara-french-press.jpg',
    title: 'Enjoy The Benefits',
    description:
      'Receive your products and enjoy the savings and convenience of our service.',
    learnMoreLink: 'https://your-site.com/learn-more/step5',
  },
];

const Step = ({ number, imageUrl, title, description, learnMoreLink }) => {
  return (
    <Section
      style={{
        marginBottom: '30px',
      }}
    >
      <Row style={{ marginBottom: '24px' }}>
        <Column style={{ width: '40%', paddingRight: '24px' }}>
          <Img
            src={imageUrl}
            width="100%"
            height="168px"
            alt={`Step image - ${number}`}
            style={{
              borderRadius: '4px',
              display: 'block',
              objectFit: 'cover',
              objectPosition: 'center',
              width: '100%',
            }}
          />
        </Column>
        <Column style={{ width: '60%', paddingRight: '24px' }}>
          <div
            style={{
              alignItems: 'center',
              backgroundColor: '#4F46E5',
              borderRadius: '100%',
              color: '#FFFFFF',
              display: 'flex',
              fontSize: '12px',
              fontWeight: '600',
              height: '24px',
              justifyContent: 'center',
              lineHeight: '1',
              marginBottom: '18px',
              width: '24px',
            }}
          >
            {number}
          </div>
          <Heading
            as="h2"
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              lineHeight: '1',
              marginBottom: '8px',
              marginTop: '0',
            }}
          >
            {title}
          </Heading>
          <Text
            style={{
              color: '#6B7280',
              fontSize: '14px',
              lineHeight: '24px',
              margin: '0',
            }}
          >
            {description}
          </Text>
          <Link
            href={learnMoreLink}
            style={{
              color: '#4F46E5',
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginTop: '12px',
              textDecoration: 'none',
            }}
          >
            Learn more →
          </Link>
        </Column>
      </Row>
    </Section>
  );
};

export const component = (
  <Html>
    <Head />
    <Preview>How Our Service Works: 5 Simple Steps</Preview>
    <Body
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      <Container
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          margin: '0 auto',
          maxWidth: '600px',
          padding: '24px 24px 0 24px',
        }}
      >
        <Heading
          as="h1"
          style={{
            fontSize: '24px',
            lineHeight: '32px',
            marginBottom: '42px',
            textAlign: 'center',
          }}
        >
          How Our Service Works: 5 Simple Steps
        </Heading>
        {steps.map((step) => (
          <Step
            key={step.number}
            number={step.number}
            imageUrl={step.imageUrl}
            title={step.title}
            description={step.description}
            learnMoreLink={step.learnMoreLink}
          />
        ))}
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
