import { Column, Hr, Img, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 text-[24px] font-semibold leading-[32px] text-gray-900">
          Functional Style
        </Text>
        <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Combine practicality and style effortlessly with our furniture,
          offering functional designs that enhance your living space.
        </Text>
      </Row>
    </Section>
    <Section>
      <Hr className="mx-0 my-[32px] w-full border border-solid !border-gray-300" />
      <Section>
        <Row>
          <Column className="align-baseline">
            <Img
              alt="heart icon"
              height="48"
              src="/static/heart-icon.png"
              width="48"
            />
          </Column>
          <Column className="w-[85%]">
            <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
              Versatile Comfort
            </Text>
            <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
              Experience ultimate comfort and versatility with our furniture
              collection, designed to adapt to your ever-changing needs.
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr className="mx-0 my-[32px] w-full border border-solid !border-gray-300" />
      <Section>
        <Row>
          <Column className="align-baseline">
            <Img
              alt="rocket icon"
              height="48"
              src="/static/rocket-icon.png"
              width="48"
            />
          </Column>
          <Column className="w-[85%]">
            <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
              Luxurious Retreat
            </Text>
            <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
              Transform your space into a haven of relaxation with our indulgent
              furniture collection.
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr className="mx-0 my-[32px] w-full border border-solid !border-gray-300" />
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
