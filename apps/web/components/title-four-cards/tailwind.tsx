import {
  Button,
  Column,
  Hr,
  Img,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 text-[20px] font-semibold leading-[28px] text-gray-900">
          Timing Products
        </Text>
        <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Dieter Rams consistently implemented his design principles over the
          course of over three decades as the Braun design leader.
        </Text>
      </Row>
      <Row className="mt-[16px]">
        <Column align="left" className="w-1/2 pr-[8px]" colSpan={1}>
          <Img
            alt="Braun Wall Clock"
            className="w-full rounded-[8px] object-cover"
            height={250}
            src="/static/braun-wall-clock.jpg"
          />
          <Text className="m-0 mt-[24px] text-[20px] font-semibold leading-[28px] text-gray-900">
            Wall Clock
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] leading-[24px] text-gray-500">
            Easy to read dial layout.
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
            $45.00
          </Text>
          <Button
            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Column>
        <Column align="left" className="w-1/2 pl-[8px]" colSpan={1}>
          <Img
            alt="Braun Wireless Alarm"
            className="w-full rounded-[8px] object-cover"
            height={250}
            src="/static/braun-wireless-alarm.jpg"
          />
          <Text className="m-0 mt-[24px] text-[20px] font-semibold leading-[28px] text-gray-900">
            Wireless Alarm
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] leading-[24px] text-gray-500">
            Designed with a focus on function.
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
            $50.00
          </Text>
          <Button
            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Column>
      </Row>
    </Section>
    <Hr className="mx-0 my-[24px] w-full border border-solid border-gray-200" />
    <Section>
      <Row>
        <Column align="left" className="w-1/2 pr-[8px]" colSpan={1}>
          <Img
            alt="Braun Classic Watch"
            className="w-full rounded-[8px] object-cover"
            height={250}
            src="/static/braun-classic-watch.jpg"
          />
          <Text className="m-0 mt-[24px] text-[20px] font-semibold leading-[28px] text-gray-900">
            Classic Watch
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] leading-[24px] text-gray-500">
            Functional, classic, and built to last.
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
            $210.00
          </Text>
          <Button
            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Column>
        <Column align="left" className="w-1/2 pl-[8px]" colSpan={1}>
          <Img
            alt="Braun Analogue Clock"
            className="w-full rounded-[8px] object-cover"
            height={250}
            src="/static/braun-analogue-clock.jpg"
          />
          <Text className="m-0 mt-[24px] text-[20px] font-semibold leading-[28px] text-gray-900">
            Analogue Clock
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] leading-[24px] text-gray-500">
            Thoughtful and simply designed.
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
            $40.00
          </Text>
          <Button
            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Column>
      </Row>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
