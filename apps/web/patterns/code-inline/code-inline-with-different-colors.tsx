import { CodeInline, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple code inline";

export const Tailwind = () => {
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

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text>
        Install the{" "}
        <CodeInline
          style={{
            backgroundColor: "rgb(134,239,172)",
            borderRadius: 6,
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 2,
            paddingBottom: 2,
          }}
        >
          @react-email/components
        </CodeInline>{" "}
        package
      </Text>
      {/* end pattern code */}
    </Layout>
  );
};

export default InlineStyles;
