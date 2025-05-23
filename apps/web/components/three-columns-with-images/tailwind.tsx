import { Column, Img, Link, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
          Our products
        </Text>
        <Text className="m-0 mt-[8px] font-semibold text-[24px] text-gray-900 leading-[32px]">
          Elegant Style
        </Text>
        <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
          We spent two years in development to bring you the next generation of
          our award-winning home brew grinder. From the finest pour-overs to the
          coarsest cold brews, your coffee will never be the same again.
        </Text>
      </Row>
    </Section>
    <Section>
      <Row>
        <Column className="w-1/3 pr-[8px]">
          <Link href="#">
            <Img
              alt="Stagg Electric Kettle"
              className="w-full rounded-[12px] object-cover"
              height={186}
              src="/static/stagg-eletric-kettle.jpg"
            />
          </Link>
        </Column>
        <Column className="w-1/3 px-[8px]">
          <Link href="#">
            <Img
              alt="Ode Grinder"
              className="w-full rounded-[12px] object-cover"
              height={186}
              src="/static/ode-grinder.jpg"
            />
          </Link>
        </Column>
        <Column className="w-1/3 pl-[8px]">
          <Link href="#">
            <Img
              alt="Clyde Electric Kettle"
              className="w-full rounded-[12px] object-cover"
              height={186}
              src="/static/clyde-electric-kettle.jpg"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
