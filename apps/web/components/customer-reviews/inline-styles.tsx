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
    <Preview>Customer Reviews</Preview>
    <Body>
      <Container
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          margin: '0 auto',
          maxWidth: '400px',
          padding: '24px 42px',
        }}
      >
        <Section>
          <Heading as="h1" style={{ fontSize: '24px', lineHeight: '32px' }}>
            Customer Reviews
          </Heading>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '12px 0 0 0',
            }}
          >
            <Text style={{ display: 'none' }}>4 out of 5 stars</Text>
          </div>
          <Section style={{ margin: '24px 0' }}>
            <Heading as="h2" style={{ display: 'none' }}>
              Review data
            </Heading>
            <dl style={{ margin: '0' }}>
              {[
                { rating: 5, count: 1019 },
                { rating: 4, count: 162 },
                { rating: 3, count: 97 },
                { rating: 2, count: 199 },
                { rating: 1, count: 147 },
              ].map((count) => (
                <div
                  key={count.rating}
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: '14px',
                    lineHeight: '20px',
                  }}
                >
                  <dt
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      flex: '1 1 0%',
                    }}
                  >
                    <Text
                      style={{
                        color: '#6B7280',
                        fontWeight: '500',
                        width: '12px',
                      }}
                    >
                      {count.rating}
                      <span style={{ display: 'none' }}> star reviews</span>
                    </Text>
                    <div
                      aria-hidden="true"
                      style={{
                        alignItems: 'center',
                        flex: '1 1 0%',
                        marginLeft: '4px',
                      }}
                    >
                      <div
                        style={{
                          flex: '1 1 0%',
                          marginLeft: '12px',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderColor: '#e5e7eb',
                            borderRadius: '6px',
                            borderWidth: '1px',
                            height: '12px',
                          }}
                        />
                        {count.count > 0 ? (
                          <div
                            style={{
                              backgroundColor: '#4f46e5',
                              borderRadius: '6px',
                              bottom: '0',
                              position: 'absolute',
                              top: '0',
                              width: `calc(${count.count} / ${1624} * 100%)`,
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </dt>
                  <dd
                    style={{
                      color: '#6B7280',
                      fontSize: '12px',
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight: '500',
                      lineHeight: '1',
                      marginLeft: '12px',
                      textAlign: 'right',
                    }}
                  >
                    {Math.round((count.count / 1624) * 100)}%
                  </dd>
                </div>
              ))}
            </dl>
            <Text
              style={{
                color: '#6B7280',
                fontSize: '12px',
                lineHeight: '24px',
                margin: '14px 0 0 0',
                textAlign: 'center',
              }}
            >
              Based on <span style={{ fontWeight: '600' }}>1624</span> Reviews
            </Text>
          </Section>
          <Hr />
          <Section style={{ marginTop: '30px' }}>
            <Heading
              as="h3"
              style={{
                color: '#111827',
                fontSize: '18px',
                fontWeight: '500',
                lineHeight: '24px',
                marginBottom: '12px',
              }}
            >
              Share your thoughts
            </Heading>
            <Text
              style={{
                color: '#6B7280',
                fontSize: '14px',
                lineHeight: '20px',
                margin: '0',
              }}
            >
              If you’ve used this product, share your thoughts with other
              customers
            </Text>
            <Button
              href="#"
              style={{
                backgroundColor: '#4f46e5',
                borderRadius: '8px',
                boxSizing: 'border-box',
                color: '#fff',
                display: 'inline-block',
                fontWeight: '600',
                margin: '26px 0 24px 0',
                maxWidth: '100%',
                padding: '12px',
                textAlign: 'center',
                width: '100%',
              }}
            >
              Write a review
            </Button>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
