import { Button, Heading, Img, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Section className="my-[16px]">
    <Img
      alt="A picture of a sunset on a curved road that goes up a mountain with lights of cars smeared from its start to finish. The picture was taken during a sunset, and has some trees all over."
      className="w-full rounded-[12px] object-cover"
      height="320"
      src="https://images.unsplash.com/photo-1702470170564-22dd352f5b88?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />
    <Section className="mt-[32px] text-center">
      <Text className="m-[16px] text-[18px] font-semibold leading-[28px] text-indigo-600">
        Our new article
      </Text>
      <Heading
        as="h1"
        className="m-0 mt-[8px] text-[36px] font-semibold leading-[40px] text-gray-900"
      >
        Designing with Furniture
      </Heading>
      <Text className="text-[16px] leading-[24px] text-gray-500">
        Unleash your inner designer as we explore how furniture plays a vital
        role in creating stunning interiors, offering insights into choosing the
        right pieces, arranging them harmoniously, and infusing your space with
        personality and style
      </Text>
      <Button
        className="mt-[16px] rounded-[8px] bg-indigo-600 px-[40px] py-[12px] font-semibold text-white"
        href="https://react.email"
      >
        Read more
      </Button>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
