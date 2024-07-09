import { Column, Img, Link, Row, Section } from "@react-email/components";

export const title = "With social icons";

const SocialLink = ({ logo, link }: { logo: string; link: string }) => {
  return (
    <Link href={link}>
      <Img className="mx-[4px]" height="36" src={logo} width="36" />
    </Link>
  );
};

export const headerWithSocialIcons = (
  /* start pattern code */
  <Section className="py-[40px] px-[32px]">
    <Row>
      <Column className="w-[80%]">
        <Img alt="company-logo" height="42" src="/static/logo.png" />
      </Column>
      <Column align="right">
        <Row align="right">
          <Column>
            <SocialLink link="#" logo="/static/facebook-logo.png" />
          </Column>
          <Column>
            <SocialLink link="#" logo="/static/twitter-logo.png" />
          </Column>
          <Column>
            <SocialLink link="#" logo="/static/instagram-logo.png" />
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
  /* end pattern code */
);

export default headerWithSocialIcons;
