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
          Collections
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
          Bundle & Save
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }}
        >
          Award-winning grinders and burrs for brewing like a barista at home.
        </Text>
      </Row>
    </Section>
    <Section style={{ marginTop: 16 }}>
      <Row style={{ marginTop: 16 }}>
        <Column style={{ width: '50%', paddingRight: 8 }}>
          <Row style={{ paddingBottom: 8 }}>
            <td>
              <Link href="#">
                <Img
                  alt="Grinder Collection"
                  height={152}
                  src="/static/grinder-collection.jpg"
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    objectFit: 'cover',
                  }}
                />
              </Link>
            </td>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <td>
              <Link href="#">
                <Img
                  alt="Bundle Collection"
                  height={152}
                  src="/static/bundle-collection.jpg"
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    objectFit: 'cover',
                  }}
                />
              </Link>
            </td>
          </Row>
        </Column>
        <Column
          style={{
            width: '50%',
            paddingLeft: 8,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <Link href="#">
            <Img
              alt="Clara French Press"
              height={152 + 152 + 8 + 8}
              src="/static/clara-french-press.jpg"
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
