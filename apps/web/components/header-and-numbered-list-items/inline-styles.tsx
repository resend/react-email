import { Column, Hr, Row, Section, Text } from '@react-email/components';
import { Fragment } from 'react/jsx-runtime';
import { Layout } from '../_components/layout';

export const component = (
  <Section style={{ marginTop: 16 }}>
    <Section style={{ paddingBottom: 24 }}>
      <Row>
        <Text
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 24,
            color: 'rgb(17,24,39)',
            lineHeight: '32px',
          }}
        >
          Functional Style
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: 'rgb(107,114,128)',
            lineHeight: '24px',
          }}
        >
          Combine practicality and style effortlessly with our furniture,
          offering functional designs that enhance your living space.
        </Text>
      </Row>
    </Section>
    {[
      {
        title: 'Vesatile Comfort',
        description:
          'Experience ultimate comfort and versatility with our furniture collection, designed to adapt to your ever-changing needs.',
      },
      {
        title: 'Luxurious Retreat',
        description:
          'Transform your space into a haven of relaxation with our indulgent furniture collection.',
      },
      {
        title: 'Unleash Creativity',
        description:
          'Unleash your inner designer with our customizable furniture options, allowing you to create a space that reflects your unique vision',
      },
      {
        title: 'Elevate Outdoor Living',
        description:
          'Take your outdoor space to new heights with our premium outdoor furniture, designed to elevate your alfresco experience.',
      },
    ].map((feature, index) => (
      <Fragment key={feature.title}>
        <Hr
          style={{
            border: '1px solid rgb(209, 213, 219)',
            margin: 0,
            width: '100%',
          }}
        />
        <Section
          style={{
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          <Row>
            <Column
              width="48"
              height="40"
              style={{
                width: 40,
                height: 40,
                paddingRight: 8,
              }}
              valign="baseline"
            >
              <Row width="40" align="left">
                <Column
                  align="center"
                  height="40"
                  style={{
                    backgroundColor: 'rgb(199, 210, 254)',
                    borderRadius: '9999px',
                    color: 'rgb(79, 70, 229)',
                    fontWeight: 600,
                    height: 40,
                    padding: 0,
                    width: 40,
                  }}
                  valign="middle"
                  width="40"
                >
                  {index + 1}
                </Column>
              </Row>
            </Column>
            <Column width="100%" style={{ width: '100%' }}>
              <Text
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: '28px',
                  color: 'rgb(17, 24, 39)',
                }}
              >
                {feature.title}
              </Text>
              <Text
                style={{
                  margin: 0,
                  fontWeight: 600,
                  paddingTop: 8,
                  fontSize: 16,
                  lineHeight: '24px',
                  color: 'rgb(107, 114, 128)',
                }}
              >
                {feature.description}
              </Text>
            </Column>
          </Row>
        </Section>
      </Fragment>
    ))}
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
