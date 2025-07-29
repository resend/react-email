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
          backgroundColor: 'rgb(255,255,255)',
          borderRadius: '8px',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '600px',
          paddingLeft: '42px',
          paddingRight: '42px',
          paddingTop: '24px',
          paddingBottom: '24px',
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
            color: 'rgb(107,114,128)',
            fontSize: '14px',
            lineHeight: '24px',
            marginBottom: '42px',
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
                  color: 'rgb(68,68,68)',
                  fontSize: '12px',
                  lineHeight: '1',
                  marginLeft: '12px',
                  textAlign: 'left',
                }}
              >
                Dissatisfied
              </Text>
            </Column>
            <Column style={{ width: '100px', textAlign: 'center' }}>
              <Text
                style={{
                  color: 'rgb(68,68,68)',
                  fontSize: '12px',
                  lineHeight: '1',
                  marginRight: '12px',
                  textAlign: 'right',
                }}
              >
                Satisfied
              </Text>
            </Column>
          </Row>
        </Section>
        <Section style={{ marginTop: '12px', marginBottom: '24px' }}>
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
                  backgroundColor: 'rgb(79,70,229)',
                  borderRadius: '6px',
                }}
              >
                <Button
                  href={`?rating=${i + 1}`}
                  style={{
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    color: 'rgb(255,255,255)',
                    display: 'flex',
                    fontSize: '16px',
                    fontWeight: '600',
                    justifyContent: 'center',
                    lineHeight: '1',
                    margin: '0px',
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
        </Section>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
