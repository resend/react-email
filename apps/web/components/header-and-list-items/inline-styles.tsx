import { Column, Hr, Img, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section style={{ marginTop: 16, marginBottom: 16 }}>
    <Section>
      <Row>
        <Text
          style={{
            margin: '0px',
            fontSize: 24,
            lineHeight: '32px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }}
        >
          Functional Style
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }}
        >
          Combine practicality and style effortlessly with our furniture,
          offering functional designs that enhance your living space.
        </Text>
      </Row>
    </Section>
    <Section>
      <Hr
        style={{
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: 32,
          marginBottom: 32,
          width: '100%',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'rgb(209,213,219) !important',
        }}
      />
      <Section>
        <Row>
          <Column style={{ verticalAlign: 'baseline' }}>
            <Img
              alt="heart icon"
              height="48"
              src="/static/heart-icon.png"
              width="48"
            />
          </Column>
          <Column style={{ width: '85%' }}>
            <Text
              style={{
                margin: '0px',
                fontSize: 20,
                fontWeight: 600,
                lineHeight: '28px',
                color: 'rgb(17,24,39)',
              }}
            >
              Versatile Comfort
            </Text>
            <Text
              style={{
                margin: '0px',
                marginTop: 8,
                fontSize: 16,
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }}
            >
              Experience ultimate comfort and versatility with our furniture
              collection, designed to adapt to your ever-changing needs.
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr
        style={{
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: 32,
          marginBottom: 32,
          width: '100%',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'rgb(209,213,219) !important',
        }}
      />
      <Section>
        <Row>
          <Column style={{ verticalAlign: 'baseline' }}>
            <Img
              alt="rocket icon"
              height="48"
              src="/static/rocket-icon.png"
              width="48"
            />
          </Column>
          <Column style={{ width: '85%' }}>
            <Text
              style={{
                margin: '0px',
                fontSize: 20,
                fontWeight: 600,
                lineHeight: '28px',
                color: 'rgb(17,24,39)',
              }}
            >
              Luxurious Retreat
            </Text>
            <Text
              style={{
                margin: '0px',
                marginTop: 8,
                fontSize: 16,
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }}
            >
              Transform your space into a haven of relaxation with our indulgent
              furniture collection.
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr
        style={{
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: 32,
          marginBottom: 32,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'rgb(209,213,219) !important',
        }}
      />
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
