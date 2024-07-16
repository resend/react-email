import { Column, Img, Link, Row, Section } from "@react-email/components";

export const title = "With social icons";

export const headerWithSocialIcons = (
  /* start pattern code */
  <Section className="py-10 px-8">
    <Row>
      <Column className="w-[80%]">
        <Img alt="company-logo" height="42" src="/static/logo.png" />
      </Column>
      <Column align="right">
        <Row align="right">
          <Column>
            <Link href="#">
              <Img
                className="mx-1"
                height="36"
                src="/static/facebook-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                className="mx-1"
                height="36"
                src="/static/twitter-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                className="mx-1"
                height="36"
                src="/static/instagram-logo.png"
                width="36"
              />
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
  /* end pattern code */
);

export default headerWithSocialIcons;
