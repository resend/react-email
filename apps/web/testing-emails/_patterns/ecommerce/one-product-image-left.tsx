import { Button, Img, Section, Text } from "@react-email/components";

export const title = "One product with image on the left";

export const oneProductImageLeft = (
  /* start pattern code */
  <Section className="my-4">
    <table className="w-full">
      <tbody className="w-full">
        <tr className="w-full">
          <td className="w-1/2 pr-8 box-border">
            <Img
              className="rounded-lg w-full object-cover"
              height={220}
              src="https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </td>
          <td className="w-1/2 align-baseline">
            <Text className="m-0 mt-2 text-xl font-semibold text-gray-900">
              Sleek Storage
            </Text>
            <Text className="mt-2 text-base text-gray-500">
              Contemporary design with ample storage space, perfect for
              organizing your essentials.
            </Text>
            <Text className="mt-2 text-lg font-semibold text-gray-900">
              $599.99
            </Text>
            <Button
              className="w-3/4 rounded-lg bg-indigo-600 py-3 px-4 text-center font-semibold text-white"
              href="https://react.email"
            >
              Buy
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
  /* end pattern code */
);

export default oneProductImageLeft;
