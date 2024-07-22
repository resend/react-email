import { CodeInline, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple code inline";

export const SimpleCodeInline = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text>
        Install the{" "}
        <CodeInline className="bg-green-300 rounded-md px-1 py-0.5">
          @react-email/components
        </CodeInline>{" "}
        package
      </Text>
      {/* end pattern code */}
    </Layout>
  );
};

export default SimpleCodeInline;
