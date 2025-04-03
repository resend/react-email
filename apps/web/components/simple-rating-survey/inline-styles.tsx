import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Html>
    <Head />
    <Preview>
      How satisfied were you overall with the initial conversation about your
      claim?
    </Preview>
    <Body>
      <Container
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          margin: '0 auto',
          maxWidth: '600px',
          padding: '24px 42px',
        }}
      >
        <Heading
          style={{
            fontSize: '24px',
            lineHeight: '32px',
            marginBottom: '16px',
          }}
        >
          How satisfied were you overall with the initial conversation about
          your claim?
        </Heading>
        <Text
          style={{
            color: '#6B7280',
            fontSize: '14px',
            lineHeight: '24px',
            margin: '0 0 42px 0',
          }}
        >
          Your feedback is important to us and it will be used to better serve
          our customers.
        </Text>
        <Section style={{ maxWidth: '300px' }}>
          <Row>
            <Column style={{ width: '100px', textAlign: 'center' }}>
              <Text
                style={{
                  color: '#444444',
                  fontSize: '12px',
                  lineHeight: '1',
                  margin: '0 0 0 12px',
                  textAlign: 'left',
                }}
              >
                Dissatisfied
              </Text>
            </Column>
            <Column style={{ width: '100px', textAlign: 'center' }}>
              <Text
                style={{
                  color: '#444444',
                  fontSize: '12px',
                  lineHeight: '1',
                  margin: '0 12px 0 0',
                  textAlign: 'right',
                }}
              >
                Satisfied
              </Text>
            </Column>
          </Row>
        </Section>
        <Section style={{ margin: '12px 0 24px 0' }}>
          <Row
            style={{
              borderCollapse: 'separate',
              borderSpacing: '12px',
              maxWidth: '300px',
              tableLayout: 'fixed',
              width: '100%',
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Column
                key={i}
                style={{
                  backgroundColor: '#4f46e5',
                  borderRadius: '6px',
                }}
              >
                <Button
                  href={`?rating=${i + 1}`}
                  style={{
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    color: '#FFFFFF',
                    display: 'flex',
                    fontSize: '16px',
                    fontWeight: '600',
                    justifyContent: 'center',
                    lineHeight: '1',
                    margin: '0',
                    padding: '12px',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  {i + 1}
                </Button>
              </Column>
            ))}
          </Row>
        </Section>
        <Section>
          <Hr />
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
        </Section>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
