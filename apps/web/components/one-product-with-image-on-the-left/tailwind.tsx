import { Button, Img, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Section className="m-[16px]">
    <table className="w-full">
      <tbody className="w-full">
        <tr className="w-full">
          <td className="box-border w-1/2 pr-[32px]">
            <Img
              alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
              className="w-full rounded-[8px] object-cover"
              height={220}
              src="https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </td>
          <td className="w-1/2 align-baseline">
            <Text className="m-0 mt-[8px] text-[20px] leading-[28px] font-semibold text-gray-900">
              Sleek Storage
            </Text>
            <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
              Contemporary design with ample storage space, perfect for
              organizing your essentials.
            </Text>
            <Text className="mt-[8px] text-[18px] leading-[28px] font-semibold text-gray-900">
              $599.99
            </Text>
            <Button
              className="w-3/4 rounded-[8px] bg-indigo-600 px-[16px] py-[12px] text-center font-semibold text-white"
              href="https://react.email"
            >
              Buy
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
