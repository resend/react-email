import { Column, Img, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section
    style={{
      marginTop: 16,
      marginBottom: 16,
    }}
  >
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
        Modern Comfort
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 16,
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }}
      >
        Experience contemporary bliss with our sleek and cozy furniture
        collection, designed for optimal comfort and style
      </Text>
    </Row>
    <Row style={{ marginTop: 16 }}>
      <Column
        align="center"
        style={{
          width: '33.333333%',
          paddingRight: 12,
          verticalAlign: 'baseline',
        }}
      >
        <Img
          alt="heart icon"
          height="48"
          src="/static/heart-icon.png"
          width="48"
        />
        <Text
          style={{
            margin: '0px',
            marginTop: 16,
            fontSize: 20,
            lineHeight: '24px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }}
        >
          Timeless Charm
        </Text>
        <Text
          style={{
            marginBottom: '0px',
            marginTop: 8,
            fontSize: 16,
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }}
        >
          Classic designs that never go out of style. Experience enduring
          elegance
        </Text>
      </Column>
      <Column
        align="center"
        style={{
          width: '33.333333%',
          paddingLeft: 12,
          verticalAlign: 'baseline',
        }}
      >
        <Img
          alt="rocket icon"
          height="48"
          src="/static/rocket-icon.png"
          width="48"
        />
        <Text
          style={{
            margin: '0px',
            marginTop: 16,
            fontSize: 20,
            lineHeight: '28px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }}
        >
          Functional Beauty
        </Text>
        <Text
          style={{
            marginBottom: '0px',
            marginTop: 8,
            fontSize: 16,
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }}
        >
          Seamlessly blending form and function. Furniture that enhances your
          everyday life.
        </Text>
      </Column>
      <Column
        align="center"
        style={{
          width: '33.333333%',
          paddingLeft: 12,
          verticalAlign: 'baseline',
        }}
      >
        <Img
          alt="megaphone icon"
          height="48"
          src="/static/megaphone-icon.png"
          width="48"
        />
        <Text
          style={{
            margin: '0px',
            marginTop: 16,
            fontSize: 20,
            lineHeight: '28px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }}
        >
          Endless Comfort
        </Text>
        <Text
          style={{
            marginBottom: '0px',
            marginTop: 8,
            fontSize: 16,
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }}
        >
          Sink into pure relaxation. Discover furniture that embraces your
          well-being.
        </Text>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
