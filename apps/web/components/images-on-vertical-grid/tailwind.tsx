import { Column, Img, Link, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
          Drinkware
        </Text>
        <Text className="m-0 mt-[8px] font-semibold text-[24px] text-gray-900 leading-[32px]">
          Ceramic Mugs
        </Text>
        <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
          Picasso your pour with a sleek ceramic cup designed for beautiful
          espresso drinks. Engineered for the outdoors and designed to enhance
          the taste of your libation of choice.
        </Text>
      </Row>
    </Section>
    <Section className="mt-[16px]">
      <Link href="#">
        <Img
          alt="Mugs Collection"
          className="rounded-[12px] object-cover"
          height={288}
          src="/static/mugs-collection.jpg"
          width="100%"
        />
      </Link>
      <Row className="mt-[16px]">
        <Column className="w-1/2 pr-[8px]">
          <Link href="#">
            <Img
              alt="Monty Art Cup - 1"
              className="rounded-[12px] object-cover"
              height={288}
              src="/static/monty-art-cup-1.jpg"
              width="100%"
            />
          </Link>
        </Column>
        <Column className="w-1/2 pl-[8px]">
          <Link href="#">
            <Img
              alt="Monty Art Cup - 2"
              className="rounded-[12px] object-cover"
              height={288}
              src="/static/monty-art-cup-2.jpg"
              width="100%"
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
