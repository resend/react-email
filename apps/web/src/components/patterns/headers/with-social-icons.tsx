import { Column, Img, Link, Row, Section, Tailwind } from "@react-email/components";

export const title = "With social icons";

const HeaderWithSocialIcons = () => {
  return (
    <Tailwind>
      <Section className="py-10">
        <Row>
          <Column className="w-[80%]">
            <Img
              alt="company-logo"
              height="42"
              src={`/company-logo.png`}
              width="60"
            />
          </Column>
          <Column align="right">
            <Row align="right">
              <Column>
                <Link href="#">
                  <Img
                    className="mx-1"
                    height="36"
                    src={`/facebook-logo.png`}
                    width="36"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="#">
                  <Img
                    className="mx-1"
                    height="36"
                    src={`/twitter-logo.png`}
                    width="36"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="#">
                  <Img
                    className="ml-1"
                    height="36"
                    src={`/instagram-logo.png`}
                    width="36"
                  />
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>
      </Section>
    </Tailwind>
  );
};

export default HeaderWithSocialIcons;
