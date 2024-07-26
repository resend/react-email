import { Column, Link, Img, Row, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Footer with one column";

export const FooterWithOneColumn = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section style={{ textAlign: "center" }}>
        <table style={{ width: "100%" }}>
          <tr style={{ width: "100%" }}>
            <td align="center">
              <Img alt="React Email logo" height="42" src="/static/logo.png" />
            </td>
          </tr>
          <tr style={{ width: "100%" }}>
            <td align="center">
              <Text
                style={{
                  marginTop: 8,
                  marginBottom: 8,
                  fontSize: 16,
                  lineHeight: 24,
                  fontWeight: 600,
                  color: "rgb(17,24,39)",
                }}
              >
                Acme corporation
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  marginBottom: 0,
                  fontSize: 16,
                  lineHeight: 24,
                  color: "rgb(107,114,128)",
                }}
              >
                Think different
              </Text>
            </td>
          </tr>
          <tr>
            <td align="center">
              <Row
                style={{
                  display: "table-cell",
                  height: 44,
                  width: 56,
                  verticalAlign: "bottom",
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
                    <Img
                      alt="X"
                      height="36"
                      src="/static/x-logo.png"
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
                      width="36"
                    />
                  </Link>
                </Column>
              </Row>
            </td>
          </tr>
          <tr>
            <td align="center">
              <Text
                style={{
                  marginTop: 8,
                  marginBottom: 8,
                  fontSize: 16,
                  lineHeight: 24,
                  fontWeight: 600,
                  color: "rgb(17,24,39)",
                }}
              >
                123 Main Street Anytown, CA 12345
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  marginBottom: 0,
                  fontSize: 16,
                  lineHeight: 24,
                  color: "rgb(107,114,128)",
                }}
              >
                mail@example.com +123456789
              </Text>
            </td>
          </tr>
        </table>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default FooterWithOneColumn;
