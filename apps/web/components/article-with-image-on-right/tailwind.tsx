/* eslint-disable react/no-unescaped-entities */
import { Img, Link, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px] text-center">
    <Section className="inline-block w-full max-w-[250px] text-left align-top">
      <Text className="m-0 text-[16px] font-semibold leading-[24px] text-indigo-600">
        What's new
      </Text>
      <Text className="m-0 mt-[8px] text-[20px] font-semibold leading-[28px] text-gray-900">
        Versatile Comfort
      </Text>
      <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
        Experience ultimate comfort and versatility with our furniture
        collection, designed to adapt to your ever-changing needs.
      </Text>
      <Link className="text-indigo-600 underline" href="https://react.email">
        Read more
      </Link>
    </Section>
    <Section className="my-[8px] inline-block w-full max-w-[220px] align-top">
      <Img
        alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
        className="rounded-[8px] object-cover"
        height={220}
        src="/static/versatile-comfort.jpg"
        width={220}
      />
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
