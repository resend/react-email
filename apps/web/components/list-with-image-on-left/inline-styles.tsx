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

export const component = (
  <Html>
    <Head />
    <Preview>How Our Service Works: 5 Simple Steps</Preview>
    <Body
      style={{
        backgroundColor: 'rgb(255,255,255)',
      }}
    >
      <Container
        style={{
          backgroundColor: 'rgb(255,255,255)',
          borderRadius: '8px',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '600px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '24px',
          paddingBottom: '0px',
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
        {[
          {
            number: 1,
            imageUrl: '/static/stagg-eletric-kettle.jpg',
            title: 'Start Your Search',
            description:
              'Search for the products you need or upload your list of requirements.',
            learnMoreLink: '#',
          },
          {
            number: 2,
            imageUrl: '/static/atmos-vacuum-canister.jpg',
            title: 'Compare & Save',
            description:
              'Compare prices and offers from different suppliers to find the best deals.',
            learnMoreLink: '#',
          },
          {
            number: 3,
            imageUrl: '/static/bundle-collection.jpg',
            title: 'Build Your Cart',
            description:
              'Select your desired items and add them to your shopping cart.',
            learnMoreLink: '#',
          },
          {
            number: 4,
            imageUrl: '/static/clara-french-press.jpg',
            title: 'Enjoy The Benefits',
            description:
              'Receive your products and enjoy the savings and convenience of our service.',
            learnMoreLink: '#',
          },
        ].map((step) => (
          <Section
            style={{
              marginBottom: '30px',
            }}
          >
            <Row style={{ marginBottom: '24px' }}>
              <Column style={{ width: '40%', paddingRight: '24px' }}>
                <Img
                  src={step.imageUrl}
                  width="100%"
                  height="168px"
                  alt={`Step image - ${step.number}`}
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
                    backgroundColor: 'rgb(79,70,229)',
                    borderRadius: '9999px',
                    color: 'rgb(255,255,255)',
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
                  {step.number}
                </div>
                <Heading
                  as="h2"
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    lineHeight: '1',
                    marginBottom: '8px',
                    marginTop: '0px',
                  }}
                >
                  {step.title}
                </Heading>
                <Text
                  style={{
                    color: 'rgb(107,114,128)',
                    fontSize: '14px',
                    lineHeight: '24px',
                    margin: '0px',
                  }}
                >
                  {step.description}
                </Text>
                <Link
                  href={step.learnMoreLink}
                  style={{
                    color: 'rgb(79,70,229)',
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginTop: '12px',
                    textDecorationLine: 'none',
                  }}
                >
                  Learn more →
                </Link>
              </Column>
            </Row>
          </Section>
        ))}
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
