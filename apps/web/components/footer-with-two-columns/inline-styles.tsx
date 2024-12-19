import { Column, Img, Link, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section>
    <Row>
      <Column colSpan={4}>
        <Img
          alt="React Email logo"
          height="42"
          src="/static/logo-without-background.png"
        />
        <Text
          style={{
            marginTop: 8,
            marginBottom: 8,
            fontSize: 16,
            lineHeight: '24px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }}
        >
          Acme corporation
        </Text>
        <Text
          style={{
            marginTop: 4,
            marginBottom: '0px',
            fontSize: 16,
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }}
        >
          Think different
        </Text>
      </Column>
      <Column
        align="left"
        style={{ display: 'table-cell', verticalAlign: 'bottom' }}
      >
        <Row
          style={{
            display: 'table-cell',
            height: 44,
            width: 56,
            verticalAlign: 'bottom',
          }}
        >
          <Column style={{ paddingRight: 8 }}>
            <Link href="#">
              <Img
                alt="Facebook"
                height="36"
                src="/static/facebook-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column style={{ paddingRight: 8 }}>
            <Link href="#">
              <Img alt="X" height="36" src="/static/x-logo.png" width="36" />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Instagram"
                height="36"
                src="/static/instagram-logo.png"
                width="36"
              />
            </Link>
          </Column>
        </Row>
        <Row>
          <Text
            style={{
              marginTop: 8,
              marginBottom: 8,
              fontSize: 16,
              lineHeight: '24px',
              fontWeight: 600,
              color: 'rgb(107,114,128)',
            }}
          >
            123 Main Street Anytown, CA 12345
          </Text>
          <Text
            style={{
              marginTop: 4,
              marginBottom: '0px',
              fontSize: 16,
              lineHeight: '24px',
              fontWeight: 600,
              color: 'rgb(107,114,128)',
            }}
          >
            mail@example.com +123456789
          </Text>
        </Row>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
