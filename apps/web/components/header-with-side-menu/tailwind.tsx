import { Column, Img, Link, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[40px] px-[32px] py-[40px]">
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
          <Column className="px-[8px]">
            <Link className="text-gray-600 [text-decoration:none]" href="#">
              About
            </Link>
          </Column>
          <Column className="px-[8px]">
            <Link className="text-gray-600 [text-decoration:none]" href="#">
              Company
            </Link>
          </Column>
          <Column className="px-[8px]">
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
  return <Layout>{component}</Layout>;
};
