import { Hr, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Text>Before divider</Text>
    <Hr className="m-[16px] border-t-2 border-[#cccccc]" />
    <Text>After divider</Text>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
