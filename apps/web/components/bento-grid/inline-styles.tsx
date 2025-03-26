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
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          margin: '0 auto',
          maxWidth: '900px',
          overflow: 'hidden',
          padding: '0',
        }}
      >
        <Section>
          <Row
            style={{
              backgroundColor: '#292524',
              borderCollapse: 'separate',
              borderSpacing: '24px',
              margin: '0',
              tableLayout: 'fixed',
              width: '100%',
            }}
          >
            <Column style={{ paddingLeft: '12px' }}>
              <Heading
                as="h1"
                style={{
                  color: '#FFFFFF',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  margin: '0 0 10px 0',
                }}
              >
                Coffee Storage
              </Heading>
              <Text
                style={{
                  color: '#ffffff99',
                  fontSize: '14px',
                  lineHeight: '20px',
                  margin: 0,
                }}
              >
                Keep your coffee fresher for longer with innovative technology.
              </Text>
              <Link
                href="#"
                style={{
                  color: '#ffffffcc',
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '12px',
                  textDecoration: 'none',
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
                  margin: '0 -6px 0 0',
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
            margin: '0 0 12px 0',
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
                  margin: '0 auto',
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
                      fontWeight: 'bold',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {product.title}
                  </Heading>
                  <Text
                    style={{
                      color: '#6b7280',
                      fontSize: '12px',
                      lineHeight: '20px',
                      margin: '0',
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
