import { Column, Link, Img, Row, Section } from "@react-email/components";

export const title = "With menu";

export const headerWithMenu = (
  /* start pattern code */
  <Section className="py-10 px-8 my-10">
    <Row>
      <Column className="w-[80%]">
        <Img alt="company-logo" height="42" src="/static/logo.png" />
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
  /* end pattern code */
);

export default headerWithMenu;
