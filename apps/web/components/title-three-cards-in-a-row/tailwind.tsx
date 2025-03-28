import { Button, Img, Row, Section, Text } from '@react-email/components';
import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
        Timing Products
      </Text>
      <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
        Dieter Rams consistently implemented his design principles over the
        course of over three decades as the Braun design leader.
      </Text>
    </Row>
    <ResponsiveRow className="mt-[16px]">
      <ResponsiveColumn className="py-[16px] pr-[4px] text-left">
        <Img
          alt="Braun Analogue Clock"
          className="w-full rounded-[8px] object-cover"
          height={180}
          src="/static/braun-analogue-clock.jpg"
        />
        <Text className="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]">
          Analogue Clock
        </Text>
        <Text className="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
          Thoughtful and simply designed.
        </Text>
        <Text className="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
          $40.00
        </Text>
        <Button
          className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
          href="https://react.email"
        >
          Buy
        </Button>
      </ResponsiveColumn>
      <ResponsiveColumn className="px-[4px] py-[16px] text-left">
        <Img
          alt="Braun Wall Clock"
          className="w-full rounded-[8px] object-cover"
          height={180}
          src="/static/braun-wall-clock.jpg"
        />
        <Text className="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]">
          Wall Clock
        </Text>
        <Text className="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
          The original easy to read dial layout.
        </Text>
        <Text className="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
          $45.00
        </Text>
        <Button
          className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
          href="https://react.email"
        >
          Buy
        </Button>
      </ResponsiveColumn>
      <ResponsiveColumn className="py-[16px] pl-[4px] text-left">
        <Img
          alt="Braun Classic Watch"
          className="w-full rounded-[8px] object-cover"
          height={180}
          src="/static/braun-classic-watch.jpg"
        />
        <Text className="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]">
          Classic Watch
        </Text>
        <Text className="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
          Functional, classic, and built to last.
        </Text>
        <Text className="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
          $210.00
        </Text>
        <Button
          className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
          href="https://react.email"
        >
          Buy
        </Button>
      </ResponsiveColumn>
    </ResponsiveRow>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
