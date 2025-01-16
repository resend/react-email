import { Column, Img, Link, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section
    style={{
      paddingTop: 40,
      paddingBottom: 40,
      paddingLeft: 32,
      paddingRight: 32,
      marginTop: 40,
      marginBottom: 40,
    }}
  >
    <Row>
      <Column style={{ width: '80%' }}>
        <Img
          alt="React Email logo"
          height="42"
          src="/static/logo-without-background.png"
        />
      </Column>
      <Column align="right">
        <Row align="right">
          <Column style={{ paddingLeft: 8, paddingRight: 8 }}>
            <Link
              href="#"
              style={{ color: 'rgb(75,85,99)', textDecoration: 'none' }}
            >
              About
            </Link>
          </Column>
          <Column style={{ paddingLeft: 8, paddingRight: 8 }}>
            <Link
              href="#"
              style={{ color: 'rgb(75,85,99)', textDecoration: 'none' }}
            >
              Company
            </Link>
          </Column>
          <Column style={{ paddingLeft: 8, paddingRight: 8 }}>
            <Link
              href="#"
              style={{ color: 'rgb(75,85,99)', textDecoration: 'none' }}
            >
              Blog
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
