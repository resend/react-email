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
    <Preview>Coffee Storage</Preview>
    <Body>
      <Container
        style={{
          backgroundColor: 'rgb(255,255,255)',
          borderRadius: '8px',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '900px',
          overflow: 'hidden',
          padding: '0px',
        }}
      >
        <Section>
          <Row
            style={{
              backgroundColor: 'rgb(41,37,36)',
              borderCollapse: 'separate',
              borderSpacing: '24px',
              margin: '0px',
              tableLayout: 'fixed',
              width: '100%',
            }}
          >
            <Column style={{ paddingLeft: '12px' }}>
              <Heading
                as="h1"
                style={{
                  color: 'rgb(255,255,255)',
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '10px',
                }}
              >
                Coffee Storage
              </Heading>
              <Text
                style={{
                  color: 'rgb(255,255,255,0.6)',
                  fontSize: '14px',
                  lineHeight: '20px',
                  margin: '0px',
                }}
              >
                Keep your coffee fresher for longer with innovative technology.
              </Text>
              <Link
                href="#"
                style={{
                  color: 'rgb(255,255,255,0.8)',
                  display: 'block',
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: '600',
                  marginTop: '12px',
                  textDecorationLine: 'none',
                }}
              >
                Shop now →
              </Link>
            </Column>
            <Column style={{ width: '42%', height: '250px' }}>
              <Img
                src="/static/coffee-bean-storage.jpg"
                alt="Coffee Bean Storage"
                style={{
                  borderRadius: '4px',
                  height: '100%',
                  marginRight: '-6px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '100%',
                }}
              />
            </Column>
          </Row>
        </Section>
        <Section
          style={{
            marginBottom: '24px',
          }}
        >
          <Row
            style={{
              borderCollapse: 'separate',
              borderSpacing: '12px',
              tableLayout: 'fixed',
              width: '100%',
            }}
          >
            {[
              {
                imageUrl: '/static/atmos-vacuum-canister.jpg',
                altText: 'Auto-Sealing Vacuum Canister',
                title: 'Auto-Sealing Vacuum Canister',
                description:
                  'A container that automatically creates an airtight seal with a button press.',
                linkUrl: '#',
              },
              {
                imageUrl: '/static/vacuum-canister-clear-glass-bundle.jpg',
                altText: '3-Pack Vacuum Containers',
                title: '3-Pack Vacuum Containers',
                description:
                  'Keep your coffee fresher for longer with this set of high-performance vacuum containers.',
                linkUrl: '#',
              },
            ].map((product) => (
              <Column
                key={product.title}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  maxWidth: '180px',
                }}
              >
                <Img
                  src={product.imageUrl}
                  alt={product.altText}
                  style={{
                    borderRadius: '4px',
                    marginBottom: '18px',
                    width: '100%',
                  }}
                />
                <div>
                  <Heading
                    as="h2"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontWeight: '700',
                      marginBottom: '8px',
                    }}
                  >
                    {product.title}
                  </Heading>
                  <Text
                    style={{
                      color: 'rgb(107,114,128)',
                      fontSize: '12px',
                      lineHeight: '20px',
                      margin: '0px',
                      paddingRight: '12px',
                    }}
                  >
                    {product.description}
                  </Text>
                </div>
              </Column>
            ))}
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
