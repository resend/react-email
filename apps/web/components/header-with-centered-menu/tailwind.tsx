import { Column, Img, Link, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[40px] px-[32px] py-[40px]">
    <Row>
      <Column align="center">
        <Img
          alt="React Email logo"
          height="42"
          src="/static/logo-without-background.png"
        />
      </Column>
    </Row>
    <Row className="mt-[40px]">
      <Column align="center">
        <table>
          <tr>
            <td className="px-[8px]">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                About
              </Link>
            </td>
            <td className="px-[8px]">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                Blog
              </Link>
            </td>
            <td className="px-[8px]">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                Company
              </Link>
            </td>
            <td className="px-[8px]">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                Features
              </Link>
            </td>
          </tr>
        </table>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
