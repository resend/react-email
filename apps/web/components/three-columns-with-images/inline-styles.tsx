import { Column, Img, Link, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section style={{ marginTop: 16, marginBottom: 16 }}>
    <Section>
      <Row>
        <Text
          style={{
            margin: '0px',
            fontSize: 16,
            lineHeight: '24px',
            fontWeight: 600,
            color: 'rgb(79,70,229)',
          }}
        >
          Our products
        </Text>
        <Text
          style={{
            margin: '0px',
            marginTop: 8,
            fontSize: 24,
            lineHeight: '32px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }}
        >
          Elegant Style
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }}
        >
          We spent two years in development to bring you the next generation of
          our award-winning home brew grinder. From the finest pour-overs to the
          coarsest cold brews, your coffee will never be the same again.
        </Text>
      </Row>
    </Section>
    <Section>
      <Row>
        <Column style={{ width: '33.333333%', paddingRight: 8 }}>
          <Link href="#">
            <Img
              alt="Stagg Electric Kettle"
              height={186}
              src="/static/stagg-eletric-kettle.jpg"
              style={{
                width: '100%',
                borderRadius: 12,
                objectFit: 'cover',
              }}
            />
          </Link>
        </Column>
        <Column
          style={{ width: '33.333333%', paddingLeft: 8, paddingRight: 8 }}
        >
          <Link href="#">
            <Img
              alt="Ode Grinder"
              height={186}
              src="/static/ode-grinder.jpg"
              style={{
                width: '100%',
                borderRadius: 12,
                objectFit: 'cover',
              }}
            />
          </Link>
        </Column>
        <Column style={{ width: '33.333333%', paddingLeft: 8 }}>
          <Link href="#">
            <Img
              alt="Clyde Electric Kettle"
              height={186}
              src="/static/clyde-electric-kettle.jpg"
              style={{
                width: '100%',
                borderRadius: 12,
                objectFit: 'cover',
              }}
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
