import { Column, Link, Img, Row, Section } from "@react-email/components";

export const pattern = (
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
);