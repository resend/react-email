import {
  Button,
  Column,
  Heading,
  Img,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="py-[16px] text-center">
    <Heading as="h1" className="mb-0 text-[30px] font-semibold leading-[36px]">
      You left something in your cart
    </Heading>
    <Section className="my-[16px] rounded-[8px] border border-solid border-gray-200 p-[16px] pt-0">
      <table className="mb-[16px]" width="100%">
        <tr>
          <th className="border-0 border-b border-solid border-gray-200 py-[8px]">
            &nbsp;
          </th>
          <th
            align="left"
            className="border-0 border-b border-solid border-gray-200 py-[8px] text-gray-500"
            colSpan={6}
          >
            <Text className="font-semibold">Product</Text>
          </th>
          <th
            align="center"
            className="border-0 border-b border-solid border-gray-200 py-[8px] text-gray-500"
          >
            <Text className="font-semibold">Quantity</Text>
          </th>
          <th
            align="center"
            className="border-0 border-b border-solid border-gray-200 py-[8px] text-gray-500"
          >
            <Text className="font-semibold">Price</Text>
          </th>
        </tr>
        <tr>
          <td className="border-0 border-b border-solid border-gray-200 py-[8px]">
            <Img
              alt="Braun Classic Watch"
              className="rounded-[8px] object-cover"
              height={110}
              src="/static/braun-classic-watch.jpg"
            />
          </td>
          <td
            align="left"
            className="border-0 border-b border-solid border-gray-200 py-[8px]"
            colSpan={6}
          >
            <Text>Classic Watch</Text>
          </td>
          <td
            align="center"
            className="border-0 border-b border-solid border-gray-200 py-[8px]"
          >
            <Text>1</Text>
          </td>
          <td
            align="center"
            className="border-0 border-b border-solid border-gray-200 py-[8px]"
          >
            <Text>$210.00</Text>
          </td>
        </tr>
        <tr>
          <td className="border-0 border-b border-solid border-gray-200 py-[8px]">
            <Img
              alt="Braun Analogue Clock"
              className="rounded-[8px] object-cover"
              height={110}
              src="/static/braun-analogue-clock.jpg"
            />
          </td>
          <td
            align="left"
            className="border-0 border-b border-solid border-gray-200 py-[8px]"
            colSpan={6}
          >
            <Text>Analogue Clock</Text>
          </td>
          <td
            align="center"
            className="border-0 border-b border-solid border-gray-200 py-[8px]"
          >
            <Text>1</Text>
          </td>
          <td
            align="center"
            className="border-0 border-b border-solid border-gray-200 py-[8px]"
          >
            <Text>$40.00</Text>
          </td>
        </tr>
      </table>
      <Row>
        <Column align="center">
          <Button
            className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
            href="https://react.email"
          >
            Checkout
          </Button>
        </Column>
      </Row>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
