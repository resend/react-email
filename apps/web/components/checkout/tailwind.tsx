import {
  Button,
  Column,
  Heading,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Section className="py-[16px] text-center">
    <Heading as="h1" className="mb-0 text-[30px] font-semibold leading-[36px]">
      You left something in your cart 👀
    </Heading>
    <Section className="m-[16px] rounded-[8px] border border-solid border-gray-200 p-[16px] pt-0">
      <table className="mb-4" width="100%">
        <tr>
          <th className="border-0 border-b border-solid border-gray-200 py-[8px]">
            &nbsp;
          </th>
          <th
            align="left"
            className="border-0 border-b border-solid border-gray-200 py-[8px] font-bold text-gray-500"
            colSpan={6}
          >
            <Text className="font-semibold">Product</Text>
          </th>
          <th
            align="center"
            className="border-0 border-b border-solid border-gray-200 py-[8px] font-bold text-gray-500"
          >
            <Text className="font-semibold">Quantity</Text>
          </th>
          <th
            align="center"
            className="border-0 border-b border-solid border-gray-200 py-[8px] font-bold text-gray-500"
          >
            <Text className="font-semibold">Price</Text>
          </th>
        </tr>
        <tr>
          <td className="border-0 border-b border-solid border-gray-200 py-[8px]">
            <Img
              alt="A picture of various Apple products laid out on a table. There is an Apple Watch with its box bellow it, there is a MacBook Pro with its box bellow it, there is an Iphone with some box bellow it, there is an Apple Keyboard, and some other items that can't quite be recognized from the picture"
              className="w-3/4 rounded-[8px] object-cover"
              height={110}
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </td>
          <td
            align="left"
            className="border-0 border-b border-solid border-gray-200 py-[8px]"
            colSpan={6}
          >
            <Text>Apple Watch</Text>
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
            <Text>$999.99</Text>
          </td>
        </tr>
        <tr>
          <td className="border-0 border-b border-solid border-gray-200 py-[8px]">
            <Img
              alt="A picture of a very nice looking product in a bottle. The bottle has a black tap and it looks like it is brown overall. The product is sitting in front of a bage wall and on top of some wooden round board"
              className="w-3/4 rounded-[8px] object-cover"
              height={110}
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </td>
          <td
            align="left"
            className="border-0 border-b border-solid border-gray-200 py-[8px]"
            colSpan={6}
          >
            <Text>Nice Fragrance</Text>
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
            <Text>$99.99</Text>
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
