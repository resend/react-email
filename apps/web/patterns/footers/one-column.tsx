import { Column, Link, Img, Row, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Footer with one column";

export const FooterWithOneColumn = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section className="text-center">
        <table className="w-full">
          <tr className="w-full">
            <td align="center">
              <Img alt="company-logo" height="42" src="/static/logo.png" />
            </td>
          </tr>
          <tr className="w-full">
            <td align="center">
              <Text className="my-2 text-base font-semibold text-gray-900">
                Acme corporation
              </Text>
              <Text className="mt-1 mb-0 text-base text-gray-500">
                Think different
              </Text>
            </td>
          </tr>
          <tr>
            <td align="center">
              <Row className="table-cell h-11 w-14 align-bottom">
                <Column className="pr-2">
                  <Link href="#">
                    <Img
                      alt="Facebook"
                      height="36"
                      src="/static/facebook-logo.png"
                      width="36"
                    />
                  </Link>
                </Column>
                <Column className="pr-2">
                  <Link href="#">
                    <Img
                      alt="Twitter"
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
              <Text className="my-2 text-base text-gray-500">
                123 Main Street Anytown, CA 12345
              </Text>
              <Text className="mt-1 text-base text-gray-500">
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
