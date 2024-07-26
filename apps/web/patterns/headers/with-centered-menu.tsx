import { Column, Link, Img, Row, Section } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Header with centered menu";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section className="py-10 px-8 my-10">
        <Row>
          <Column align="center">
            <Img
              alt="React Email logo"
              height="42"
              src="/static/logo-without-background.png"
            />
          </Column>
        </Row>
        <Row className="mt-10">
          <Column align="center">
            <table>
              <tr>
                <td className="px-2">
                  <Link
                    className="text-gray-600 [text-decoration:none]"
                    href="#"
                  >
                    About
                  </Link>
                </td>
                <td className="px-2">
                  <Link
                    className="text-gray-600 [text-decoration:none]"
                    href="#"
                  >
                    Company
                  </Link>
                </td>
                <td className="px-2">
                  <Link
                    className="text-gray-600 [text-decoration:none]"
                    href="#"
                  >
                    Blog
                  </Link>
                </td>
                <td className="px-2">
                  <Link
                    className="text-gray-600 [text-decoration:none]"
                    href="#"
                  >
                    Contacts
                  </Link>
                </td>
              </tr>
            </table>
          </Column>
        </Row>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
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
          <Column align="center">
            <Img
              alt="React Email logo"
              height="42"
              src="/static/logo-without-background.png"
            />
          </Column>
        </Row>
        <Row style={{ marginTop: 40 }}>
          <Column align="center">
            <table>
              <tr>
                <td style={{ paddingRight: 8, paddingLeft: 8 }}>
                  <Link
                    href="#"
                    style={{
                      color: "rgb(75,85,99)",
                      textDecoration: "none",
                    }}
                  >
                    About
                  </Link>
                </td>
                <td style={{ paddingRight: 8, paddingLeft: 8 }}>
                  <Link
                    href="#"
                    style={{
                      color: "rgb(75,85,99)",
                      textDecoration: "none",
                    }}
                  >
                    Company
                  </Link>
                </td>
                <td style={{ paddingRight: 8, paddingLeft: 8 }}>
                  <Link
                    href="#"
                    style={{
                      color: "rgb(75,85,99)",
                      textDecoration: "none",
                    }}
                  >
                    Blog
                  </Link>
                </td>
                <td style={{ paddingRight: 8, paddingLeft: 8 }}>
                  <Link
                    href="#"
                    style={{
                      color: "rgb(75,85,99)",
                      textDecoration: "none",
                    }}
                  >
                    Contacts
                  </Link>
                </td>
              </tr>
            </table>
          </Column>
        </Row>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;
