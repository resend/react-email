import { Column, Img, Link, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="text-center">
    <table className="w-full">
      <tr className="w-full">
        <td align="center">
          <Img
            alt="React Email logo"
            height="42"
            src="/static/logo-without-background.png"
          />
        </td>
      </tr>
      <tr className="w-full">
        <td align="center">
          <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
            Acme corporation
          </Text>
          <Text className="mt-[4px] mb-0 text-[16px] text-gray-500 leading-[24px]">
            Think different
          </Text>
        </td>
      </tr>
      <tr>
        <td align="center">
          <Row className="table-cell h-[44px] w-[56px] align-bottom">
            <Column className="pr-[8px]">
              <Link href="#">
                <Img
                  alt="Facebook"
                  height="36"
                  src="/static/facebook-logo.png"
                  width="36"
                />
              </Link>
            </Column>
            <Column className="pr-[8px]">
              <Link href="#">
                <Img alt="X" height="36" src="/static/x-logo.png" width="36" />
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
          <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
            123 Main Street Anytown, CA 12345
          </Text>
          <Text className="mt-[4px] mb-0 font-semibold text-[16px] text-gray-500 leading-[24px]">
            mail@example.com +123456789
          </Text>
        </td>
      </tr>
    </table>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
