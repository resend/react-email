import { Column, Link, Img, Row, Section } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "With menu";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section className="py-10 px-8 my-10">
        <Row>
          <Column className="w-[80%]">
            <Img alt="React Email logo" height="42" src="/static/logo.png" />
          </Column>
          <Column align="right">
            <Row align="right">
              <Column className="px-2">
                <Link className="text-gray-600 [text-decoration:none]" href="#">
                  About
                </Link>
              </Column>
              <Column className="px-2">
                <Link className="text-gray-600 [text-decoration:none]" href="#">
                  Company
                </Link>
              </Column>
              <Column className="px-2">
                <Link className="text-gray-600 [text-decoration:none]" href="#">
                  Blog
                </Link>
              </Column>
            </Row>
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
          <Column style={{ width: "80%" }}>
            <Img alt="React Email logo" height="42" src="/static/logo.png" />
          </Column>
          <Column align="right">
            <Row align="right">
              <Column style={{ paddingLeft: 8, paddingRight: 8 }}>
                <Link
                  href="#"
                  style={{ color: "rgb(75,85,99)", textDecoration: "none" }}
                >
                  About
                </Link>
              </Column>
              <Column style={{ paddingLeft: 8, paddingRight: 8 }}>
                <Link
                  href="#"
                  style={{ color: "rgb(75,85,99)", textDecoration: "none" }}
                >
                  Company
                </Link>
              </Column>
              <Column style={{ paddingLeft: 8, paddingRight: 8 }}>
                <Link
                  href="#"
                  style={{ color: "rgb(75,85,99)", textDecoration: "none" }}
                >
                  Blog
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;
