import { Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Text className="text-2xl font-semibold text-indigo-400">
      Amazing content
    </Text>
    <Text>
      This is the actual content that the accented text above refers to.
    </Text>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
