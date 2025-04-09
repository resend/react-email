import { Column, Hr, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 font-semibold text-[24px] text-gray-900 leading-[32px]">
          Functional Style
        </Text>
        <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
          Combine practicality and style effortlessly with our furniture,
          offering functional designs that enhance your living space.
        </Text>
      </Row>
    </Section>
    <Hr className="!border-gray-300 mx-0 my-[24px] w-full border border-solid" />
    <Section>
      <Row>
        <Column className="align-baseline">
          <table className="text-center">
            <td
              align="center"
              className="h-[40px] w-[40px] rounded-full bg-indigo-200 p-0"
            >
              <Text className="m-0 font-semibold text-indigo-600">1</Text>
            </td>
          </table>
        </Column>
        <Column className="w-[90%]">
          <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
            Versatile Comfort
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            Experience ultimate comfort and versatility with our furniture
            collection, designed to adapt to your ever-changing needs.
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="!border-gray-300 mx-0 my-[24px] w-full border border-solid" />
    <Section>
      <Row>
        <Column className="align-baseline">
          <table className="text-center">
            <td
              align="center"
              className="h-[40px] w-[40px] rounded-full bg-indigo-200 p-0"
            >
              <Text className="m-0 font-semibold text-indigo-600">2</Text>
            </td>
          </table>
        </Column>
        <Column className="w-[90%]">
          <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
            Luxurious Retreat
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            Transform your space into a haven of relaxation with our indulgent
            furniture collection.
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="!border-gray-300 mx-0 my-[24px] w-full border border-solid" />
    <Section>
      <Row>
        <Column className="align-baseline">
          <table className="text-center">
            <td
              align="center"
              className="h-[40px] w-[40px] rounded-full bg-indigo-200 p-0"
            >
              <Text className="m-0 font-semibold text-indigo-600">3</Text>
            </td>
          </table>
        </Column>
        <Column className="w-[90%]">
          <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
            Unleash Creativity
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            Unleash your inner designer with our customizable furniture options,
            allowing you to create a space that reflects your unique vision
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="!border-gray-300 mx-0 my-[24px] w-full border border-solid" />
    <Section>
      <Row>
        <Column className="align-baseline">
          <table className="text-center">
            <td
              align="center"
              className="h-[40px] w-[40px] rounded-full bg-indigo-200 p-0"
            >
              <Text className="m-0 font-semibold text-indigo-600">4</Text>
            </td>
          </table>
        </Column>
        <Column className="w-[90%]">
          <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
            Elevate Outdoor Living
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] text-gray-500 leading-[24px]">
            Take your outdoor space to new heights with our premium outdoor
            furniture, designed to elevate your alfresco experience.
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="!border-gray-300 mx-0 my-[24px] w-full border border-solid" />
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
