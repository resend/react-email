import { Column, Link, Img, Row, Section } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component =  (
  <Section className="my-10 px-8 py-10">
    <Row>
      <Column className="w-[80%]">
        <Img
          alt="React Email logo"
          height="42"
          src="/static/logo-without-background.png"
        />
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
);

export default () => {
  return <Layout>
    {component}
  </Layout>;
};
