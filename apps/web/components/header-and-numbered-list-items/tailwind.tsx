import { Column, Hr, Row, Section, Text } from '@react-email/components';
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
    <Hr className="mx-0 my-[24px] w-full border border-solid !border-gray-300" />
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
    <Hr className="mx-0 my-[24px] w-full border border-solid !border-gray-300" />
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
    <Hr className="mx-0 my-[24px] w-full border border-solid !border-gray-300" />
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
          <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
            Unleash Creativity
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
            Unleash your inner designer with our customizable furniture options,
            allowing you to create a space that reflects your unique vision
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="mx-0 my-[24px] w-full border border-solid !border-gray-300" />
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
          <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
            Elevate Outdoor Living
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
            Take your outdoor space to new heights with our premium outdoor
            furniture, designed to elevate your alfresco experience.
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="mx-0 my-[24px] w-full border border-solid !border-gray-300" />
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
