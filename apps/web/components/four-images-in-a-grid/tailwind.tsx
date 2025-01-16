import { Column, Img, Link, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Section className="mt-[42px]">
      <Row>
        <Text className="m-0 text-[16px] font-semibold leading-[24px] text-indigo-600">
          Our products
        </Text>
        <Text className="m-0 mt-[8px] text-[24px] font-semibold leading-[32px] text-gray-900">
          Elegant Style
        </Text>
        <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
          We spent two years in development to bring you the next generation of
          our award-winning home brew grinder. From the finest pour-overs to the
          coarsest cold brews, your coffee will never be the same again.
        </Text>
      </Row>
    </Section>
    <Section className="mt-[16px]">
      <Row className="mt-[16px]">
        <Column className="w-[50%] pr-[8px]">
          <Link href="#">
            <Img
              alt="Stagg Electric Kettle"
              className="w-full rounded-[12px] object-cover"
              height={288}
              src="/static/stagg-eletric-kettle.jpg"
            />
          </Link>
        </Column>
        <Column className="w-[50%] pl-[8px]">
          <Link href="#">
            <Img
              alt="Ode Grinder"
              className="w-full rounded-[12px] object-cover"
              height={288}
              src="/static/ode-grinder.jpg"
            />
          </Link>
        </Column>
      </Row>
      <Row className="mt-[16px]">
        <Column className="w-[50%] pr-[8px]">
          <Link href="#">
            <Img
              alt="Atmos Vacuum Canister"
              className="w-full rounded-[12px] object-cover"
              height={288}
              src="/static/atmos-vacuum-canister.jpg"
            />
          </Link>
        </Column>
        <Column className="w-[50%] pl-[8px]">
          <Link href="#">
            <Img
              alt="Clyde Electric Kettle"
              className="w-full rounded-[12px] object-cover"
              height={288}
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
