import { Img, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 font-semibold text-[24px] text-gray-900 leading-[32px]">
        Modern Comfort
      </Text>
      <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
        Experience contemporary bliss with our sleek and cozy furniture
        collection, designed for optimal comfort and style
      </Text>
    </Row>
    <table width="100%">
      <tr className="mt-[16px] w-full">
        <td align="center" className="w-1/2 pr-[12px] align-baseline">
          <Img
            alt="heart icon"
            height="48"
            src="/static/heart-icon.png"
            width="48"
          />
          <Text className="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[28px]">
            Timeless Beauty
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
            Indulge in the enduring beauty of our furniture pieces, crafted with
            exquisite attention to detail and timeless design
          </Text>
        </td>
        <td align="center" className="w-1/2 pr-[12px] align-baseline">
          <Img
            alt="rocket icon"
            height="48"
            src="/static/rocket-icon.png"
            width="48"
          />
          <Text className="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[28px]">
            Effortless Function
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
            Discover furniture that seamlessly combines form and function,
            making everyday living a breeze with its practicality
          </Text>
        </td>
      </tr>
      <tr className="mt-[16px] w-full">
        <td align="center" className="w-1/2 pr-[12px] align-baseline">
          <Img
            alt="megaphone icon"
            height="48"
            src="/static/megaphone-icon.png"
            width="48"
          />
          <Text className="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[28px]">
            Customize Your Space
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
            Personalize your living environment with our customizable furniture
            options, allowing you to tailor your space to perfection
          </Text>
        </td>
        <td align="center" className="w-1/2 pr-[12px] align-baseline">
          <Img
            alt="cube icon"
            height="48"
            src="/static/cube-icon.png"
            width="48"
          />
          <Text className="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[28px]">
            Outdoor Serenity
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
            Create a tranquil outdoor retreat with our premium outdoor
            furniture, offering both durability and serene relaxation
          </Text>
        </td>
      </tr>
    </table>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
