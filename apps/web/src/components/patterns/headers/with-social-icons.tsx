import {
  Column,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
} from "@react-email/components";

export const title = "With social icons";

const SocialLink = ({ logo, link }: { logo: string; link: string }) => {
  return (
    <Link href={link}>
      <Img className="mx-1" height="36" src={logo} width="36" />
    </Link>
  );
};

export const HeaderWithSocialIcons = () => {
  return (
    <Tailwind>
      <Section className="py-[40px] px-[32px] rounded border border-solid border-gray-200 bg-white">
        <Row>
          <Column className="w-[80%]">
            <Img
              alt="company-logo"
              src="/static/company-logo.png"
              height="42"
            />
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
    </Tailwind>
  );
};

export default HeaderWithSocialIcons;
