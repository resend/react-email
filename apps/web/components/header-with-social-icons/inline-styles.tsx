import { Column, Img, Link, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section
    style={{
      paddingTop: 40,
      paddingBottom: 40,
      paddingLeft: 32,
      paddingRight: 32,
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
          <Column>
            <Link href="#">
              <Img
                alt="X"
                height="36"
                src="/static/x-logo.png"
                style={{
                  marginLeft: 4,
                  marginRight: 4,
                }}
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Instagram"
                height="36"
                src="/static/instagram-logo.png"
                style={{
                  marginLeft: 4,
                  marginRight: 4,
                }}
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Facebook"
                height="36"
                src="/static/facebook-logo.png"
                style={{ marginLeft: 4, marginRight: 4 }}
                width="36"
              />
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
