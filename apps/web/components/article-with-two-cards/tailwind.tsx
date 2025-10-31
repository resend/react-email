import { Column, Img, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
        Elevate Outdoor Living
      </Text>
      <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
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
        <Text className="font-semibold text-[16px] text-indigo-600 leading-[24px]">
          What's new
        </Text>
        <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
          Multifunctional Marvels
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
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
        <Text className="font-semibold text-[16px] text-indigo-600 leading-[24px]">
          What's new
        </Text>
        <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
          Timeless Classics
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
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
