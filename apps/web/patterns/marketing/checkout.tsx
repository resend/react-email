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

export const title = "Checkout";

export const Checkout = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section className="py-4 text-center">
        <Heading as="h1" className="text-3xl mb-0 font-semibold">
          You left something in your cart 👀
        </Heading>
        <Section className="p-4 pt-0 my-4 rounded-lg border border-solid border-gray-200">
          <table className="mb-4" width="100%">
            <tr>
              <th className="py-2 border-0 border-b border-solid border-gray-200">
                &nbsp;
              </th>
              <th
                align="left"
                className="py-2 font-bold text-gray-500 border-0 border-b border-solid border-gray-200"
                colSpan={6}
              >
                <Text className="font-semibold">Product</Text>
              </th>
              <th
                align="center"
                className="py-2 font-bold text-gray-500 border-0 border-b border-solid border-gray-200"
              >
                <Text className="font-semibold">Quantity</Text>
              </th>
              <th
                align="center"
                className="py-2 font-bold text-gray-500 border-0 border-b border-solid border-gray-200"
              >
                <Text className="font-semibold">Price</Text>
              </th>
            </tr>
            <tr>
              <td className="py-2 border-0 border-b border-solid border-gray-200">
                <Img
                  alt="A picture of various Apple products laid out on a table. There is an Apple Watch with its box bellow it, there is a MacBook Pro with its box bellow it, there is an Iphone with some box bellow it, there is an Apple Keyboard, and some other items that can't quite be recognized from the picture"
                  className="object-cover rounded-lg w-3/4"
                  height={110}
                  src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </td>
              <td
                align="left"
                className="py-2 border-0 border-b border-solid border-gray-200"
                colSpan={6}
              >
                <Text>Apple Watch</Text>
              </td>
              <td
                align="center"
                className="py-2 border-0 border-b border-solid border-gray-200"
              >
                <Text>1</Text>
              </td>
              <td
                align="center"
                className="py-2 border-0 border-b border-solid border-gray-200"
              >
                <Text>$999.99</Text>
              </td>
            </tr>
            <tr>
              <td className="py-2 border-0 border-b border-solid border-gray-200">
                <Img
                  alt="A picture of a very nice looking product in a bottle. The bottle has a black tap and it looks like it is brown overall. The product is sitting in front of a bage wall and on top of some wooden round board"
                  className="object-cover rounded-lg w-3/4"
                  height={110}
                  src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </td>
              <td
                align="left"
                className="py-2 border-0 border-b border-solid border-gray-200"
                colSpan={6}
              >
                <Text>Nice Fragrance</Text>
              </td>
              <td
                align="center"
                className="py-2 border-0 border-b border-solid border-gray-200"
              >
                <Text>1</Text>
              </td>
              <td
                align="center"
                className="py-2 border-0 border-b border-solid border-gray-200"
              >
                <Text>$99.99</Text>
              </td>
            </tr>
          </table>
          <Row>
            <Column align="center">
              <Button
                className="w-full box-border px-3 rounded-lg text-center bg-indigo-600 py-3 font-semibold text-white"
                href="https://react.email"
              >
                Checkout
              </Button>
            </Column>
          </Row>
        </Section>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default Checkout;
