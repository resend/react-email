/* eslint-disable react/no-unescaped-entities */
import { Column, Img, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section style={{ marginTop: 16, marginBottom: 16 }}>
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
        Unleash Timeless Comfort in Your Home
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 16,
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }}
      >
        Elevate your space with impeccable quality, and versatile styles.
      </Text>
    </Row>
    <Row style={{ marginTop: 16 }}>
      <Column
        colSpan={1}
        style={{
          width: '50%',
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
            lineHeight: '28px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }}
        >
          Multifunctional Marvels
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
          Discover comfort and style with our exquisite furniture collection at
          Acme. Transform your living space into a haven of timeless comfort
          with our range of plush sofas, elegant dining sets, cozy armchairs,
          and functional storage solutions.
        </Text>
      </Column>
      <Column
        colSpan={1}
        style={{ paddingLeft: 12, verticalAlign: 'baseline', width: '50%' }}
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
          Impeccable Quality
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
          Quality is our priority. Our furniture is meticulously crafted by
          skilled artisans, ensuring durability and elegance. From solid wood
          frames to carefully selected upholstery fabrics, each piece is
          thoughtfully designed to deliver unmatched quality.
        </Text>
      </Column>
    </Row>
    <Row style={{ marginTop: 32 }}>
      <Column
        colSpan={1}
        style={{
          width: '50%',
          paddingRight: 12,
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
          Versatile Styles
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
          Express your unique style with our diverse range of furniture options.
          Whether you prefer contemporary minimalism, rustic charm, or timeless
          elegance, our selection offers something to complement every taste.
          Choose from sleek modern lines to ornate detailing.
        </Text>
      </Column>
      <Column
        colSpan={1}
        style={{ width: '50%', paddingLeft: 12, verticalAlign: 'baseline' }}
      >
        <Img
          alt="cube icon"
          height="48"
          src="/static/cube-icon.png"
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
          Personalized Service
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
          Experience personalised service at Acme. Our friendly team is
          dedicated to assisting you in finding the perfect furniture pieces.
          From fabric selection to space planning, we're here to ensure your
          complete satisfaction. Indulge in the luxury of personalised furniture
          shopping.
        </Text>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
