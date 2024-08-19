import { CodeInline, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component =  (
  <Text>
    Install the{" "}
    <CodeInline className="rounded-md bg-gray-300 px-1 py-0.5">
      @react-email/components
    </CodeInline>{" "}
    package
  </Text>
);

export default () => {
  return <Layout>
    {component}
  </Layout>;
};
