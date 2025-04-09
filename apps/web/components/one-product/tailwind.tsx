import { Button, Heading, Img, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Img
      alt="Braun Collection"
      className="w-full rounded-[12px] object-cover"
      height={320}
      src="/static/braun-collection.jpg"
    />
    <Section className="mt-[32px] text-center">
      <Text className="mt-[16px] font-semibold text-[18px] text-indigo-600 leading-[28px]">
        Classic Watches
      </Text>
      <Heading
        as="h1"
        className="font-semibold text-[36px] text-gray-900 leading-[40px] tracking-[0.4px]"
      >
        Elegant Comfort
      </Heading>
      <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
        Dieter Rams’ work has an outstanding quality which distinguishes it from
        the vast majority of industrial design of the entire 20th Century.
      </Text>
      <Text className="font-semibold text-[16px] text-gray-900 leading-[24px]">
        $210.00
      </Text>
      <Button
        className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
        href="https://react.email"
      >
        Buy now
      </Button>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
