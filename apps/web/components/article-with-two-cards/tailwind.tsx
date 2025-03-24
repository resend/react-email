/* eslint-disable react/no-unescaped-entities */
import { Column, Img, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
        Elevate Outdoor Living
      </Text>
      <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
        Take your outdoor space to new heights with our premium outdoor
        furniture, designed to elevate your alfresco experience.
      </Text>
    </Row>
    <Row className="mt-[16px]">
      <Column
        className="box-border w-[50%] pr-[8px] align-baseline"
        colSpan={1}
      >
        <Img
          alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
          className="w-full rounded-[8px] object-cover"
          height="180"
          src="/static/outdoor-living.jpg"
        />
        <Text className="text-[16px] font-semibold leading-[24px] text-indigo-600">
          What's new
        </Text>
        <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
          Multifunctional Marvels
        </Text>
        <Text className="mb-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Discover the innovative world of multifunctional furniture, where
          style meets practicality, offering creative solutions for maximizing
          space and enhancing functionality in your home
        </Text>
      </Column>
      <Column
        className="box-border w-[50%] pl-[8px] align-baseline"
        colSpan={1}
      >
        <Img
          alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
          className="w-full rounded-[8px] object-cover"
          height="180"
          src="/static/outdoor-living.jpg"
        />
        <Text className="text-[16px] font-semibold leading-[24px] text-indigo-600">
          What's new
        </Text>
        <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
          Timeless Classics
        </Text>
        <Text className="mb-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Step into the world of timeless classics as we explore iconic
          furniture pieces that have stood the test of time, adding enduring
          elegance and sophistication to any interior
        </Text>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
