import { Hr, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Text>Before hr</Text>
    <Hr className="m-[16px] border-[#cccccc] border-t-2" />
    <Text>After hr</Text>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
