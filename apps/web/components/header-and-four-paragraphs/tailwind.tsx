/* eslint-disable react/no-unescaped-entities */
import { Column, Img, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 text-[24px] font-semibold leading-[32px] text-gray-900">
        Unleash Timeless Comfort in Your Home
      </Text>
      <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
        Elevate your space with impeccable quality, and versatile styles.
      </Text>
    </Row>
    <Row className="mt-[16px]">
      <Column className="w-1/2 pr-[12px] align-baseline" colSpan={1}>
        <Img
          alt="heart icon"
          height="48"
          src="/static/heart-icon.png"
          width="48"
        />
        <Text className="m-0 mt-[16px] text-[20px] font-semibold leading-[28px] text-gray-900">
          Multifunctional Marvels
        </Text>
        <Text className="mb-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Discover comfort and style with our exquisite furniture collection at
          Acme. Transform your living space into a haven of timeless comfort
          with our range of plush sofas, elegant dining sets, cozy armchairs,
          and functional storage solutions.
        </Text>
      </Column>
      <Column className="w-1/2 pl-[12px] align-baseline" colSpan={1}>
        <Img
          alt="rocket icon"
          height="48"
          src="/static/rocket-icon.png"
          width="48"
        />
        <Text className="m-0 mt-[16px] text-[20px] font-semibold leading-[28px] text-gray-900">
          Impeccable Quality
        </Text>
        <Text className="mb-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Quality is our priority. Our furniture is meticulously crafted by
          skilled artisans, ensuring durability and elegance. From solid wood
          frames to carefully selected upholstery fabrics, each piece is
          thoughtfully designed to deliver unmatched quality.
        </Text>
      </Column>
    </Row>
    <Row className="mt-[32px]">
      <Column className="w-1/2 pr-[12px] align-baseline" colSpan={1}>
        <Img
          alt="megaphone icon"
          height="48"
          src="/static/megaphone-icon.png"
          width="48"
        />
        <Text className="m-0 mt-[16px] text-[20px] font-semibold leading-[28px] text-gray-900">
          Versatile Styles
        </Text>
        <Text className="mb-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Express your unique style with our diverse range of furniture options.
          Whether you prefer contemporary minimalism, rustic charm, or timeless
          elegance, our selection offers something to complement every taste.
          Choose from sleek modern lines to ornate detailing.
        </Text>
      </Column>
      <Column className="w-1/2 pl-[12px] align-baseline" colSpan={1}>
        <Img
          alt="cube icon"
          height="48"
          src="/static/cube-icon.png"
          width="48"
        />
        <Text className="m-0 mt-[16px] text-[20px] font-semibold leading-[28px] text-gray-900">
          Personalized Service
        </Text>
        <Text className="mb-0 mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Experience personalised service at Acme. Our friendly team is
          dedicated to assisting you in finding the perfect furniture pieces.
          From fabric selection to space planning, we're here to ensure your
          complete satisfaction. Indulge in the luxury of personalised furniture
          shopping.
        </Text>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
