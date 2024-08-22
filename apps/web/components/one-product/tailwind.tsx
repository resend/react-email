import { Button, Heading, Img, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Section className="m-[16px]">
    <Img
      alt="A picture on nice dark carpet of various black items laid out. The items include: a box that has text that reads 'BLVCK, Paris', a bottle, some flip flops and two six-sided dices."
      className="w-full rounded-[12px] object-cover"
      height={320}
      src="https://images.unsplash.com/photo-1612188842101-f976582906fc?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />
    <Section className="mt-[32px] text-center">
      <Text className="m-[16px] text-[18px] leading-[28px] font-semibold text-indigo-600">
        Our new product
      </Text>
      <Heading
        as="h1"
        className="text-[36px] leading-[40px] font-semibold tracking-tight text-gray-900"
      >
        Elegant Comfort
      </Heading>
      <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
        Luxurious, plush seating for a sophisticated and cozy living room
        ambiance
      </Text>
      <Text className="text-[16px] leading-[24px] font-semibold text-gray-900">$999.99</Text>
      <Button
        className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
        href="https://react.email"
      >
        Buy
      </Button>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
