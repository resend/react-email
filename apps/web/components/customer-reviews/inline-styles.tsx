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
    <Preview>Customer Reviews</Preview>
    <Body>
      <Container
        style={{
          backgroundColor: 'rgb(255,255,255)',
          borderRadius: '8px',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '400px',
          paddingLeft: '42px',
          paddingRight: '42px',
          paddingTop: '24px',
          paddingBottom: '24px',
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
              marginTop: '12px',
            }}
          >
            <Text style={{ display: 'none' }}>4 out of 5 stars</Text>
          </div>
          <Section style={{ marginTop: '24px', marginBottom: '24px' }}>
            <Heading as="h2" style={{ display: 'none' }}>
              Review data
            </Heading>
            <dl style={{ margin: '0px' }}>
              {[
                { rating: 5, count: 1019 },
                { rating: 4, count: 162 },
                { rating: 3, count: 97 },
                { rating: 2, count: 199 },
                { rating: 1, count: 147 },
              ].map(({ count, rating }) => (
                <Row
                  align="center"
                  key={rating}
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                  }}
                >
                  <Column align="center" valign="middle">
                    <Row>
                      <Column>
                        <dt>
                          <Row>
                            <Column width={undefined}>
                              <Text
                                style={{
                                  color: 'rgb(107,114,128)',
                                  fontWeight: '500',
                                  width: '12px',
                                }}
                              >
                                {rating}
                                <span style={{ display: 'none' }}>
                                  {' '}
                                  star reviews
                                </span>
                              </Text>
                            </Column>
                            <Column
                              width="264"
                              height="12"
                              style={{
                                width: 264,
                                height: 12,
                                paddingLeft: 12,
                              }}
                              aria-hidden="true"
                              valign="middle"
                            >
                              <Row
                                aria-hidden="true"
                                width="264"
                                style={{
                                  width: 264,
                                  height: 12,
                                  backgroundColor: 'rgb(243,244,246)',
                                  border: '1px solid rgb(229,231,235)',
                                  borderRadius: 6,
                                }}
                              >
                                <Column
                                  height="12"
                                  style={{
                                    backgroundColor: 'rgb(79,70,229)',
                                    borderRadius: 6,
                                    height: 12,
                                    width: `${(count / 1624) * 264}px`,
                                  }}
                                  width={(count / 1624) * 264}
                                />
                                <Column
                                  width={(1 - count / 1624) * 264}
                                  style={{
                                    width: `${(1 - count / 1624) * 264}px`,
                                  }}
                                />
                              </Row>
                            </Column>
                          </Row>
                        </dt>
                      </Column>
                      <Column width="100%" style={{ width: '100%' }}>
                        <dd
                          style={{
                            color: 'rgb(107,114,128)',
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: '500',
                            lineHeight: '1',
                            marginLeft: 12,
                            textAlign: 'right',
                          }}
                        >
                          {Math.round((count / 1624) * 100)}%
                        </dd>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              ))}
            </dl>
            <Text
              style={{
                color: 'rgb(107,114,128)',
                fontSize: '12px',
                lineHeight: '24px',
                marginTop: '14px',
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
                color: 'rgb(17,24,39)',
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
                color: 'rgb(107,114,128)',
                fontSize: '14px',
                lineHeight: '20px',
                margin: '0px',
              }}
            >
              If you’ve used this product, share your thoughts with other
              customers
            </Text>
            <Button
              href="#"
              style={{
                backgroundColor: 'rgb(79,70,229)',
                borderRadius: '8px',
                boxSizing: 'border-box',
                color: 'rgb(255,255,255)',
                display: 'inline-block',
                fontWeight: '600',
                marginTop: '26px',
                marginBottom: '24px',
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
