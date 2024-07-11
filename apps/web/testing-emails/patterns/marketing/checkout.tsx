 
import {
  Button,
  Column,
  Heading,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";

export const title = "Checkout";

export const checkout = (
  /* start pattern code */
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
            className="py-2 border-0 border-b border-solid border-gray-200"
            colSpan={6}
          >
            <Text className="font-semibold">Product</Text>
          </th>
          <th
            align="center"
            className="py-2 border-0 border-b border-solid border-gray-200"
          >
            <Text className="font-semibold">Quantity</Text>
          </th>
          <th
            align="center"
            className="py-2 border-0 border-b border-solid border-gray-200"
          >
            <Text className="font-semibold">Price</Text>
          </th>
        </tr>
        <tr>
          <td className="py-2 border-0 border-b border-solid border-gray-200">
            <Img
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
            <Text className="font-semibold">Apple Watch</Text>
          </td>
          <td
            align="center"
            className="py-2 border-0 border-b border-solid border-gray-200"
          >
            <Text className="font-semibold">1</Text>
          </td>
          <td
            align="center"
            className="py-2 border-0 border-b border-solid border-gray-200"
          >
            <Text className="font-semibold">$999.99</Text>
          </td>
        </tr>
        <tr>
          <td className="py-2 border-0 border-b border-solid border-gray-200">
            <Img
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
            <Text className="font-semibold">Nice Fragrance</Text>
          </td>
          <td
            align="center"
            className="py-2 border-0 border-b border-solid border-gray-200"
          >
            <Text className="font-semibold">1</Text>
          </td>
          <td
            align="center"
            className="py-2 border-0 border-b border-solid border-gray-200"
          >
            <Text className="font-semibold">$99.99</Text>
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
  /* end pattern code */
);

export default checkout;
