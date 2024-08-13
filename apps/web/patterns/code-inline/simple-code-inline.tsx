import { CodeInline, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple code inline";

export const Tailwind = () => {
  return (
    <Text>
      Install the{" "}
      <CodeInline className="rounded-md bg-gray-300 px-1 py-0.5">
        @react-email/components
      </CodeInline>{" "}
      package
    </Text>
  );
};

export const InlineStyles = () => {
  return (
    <Text>
      Install the{" "}
      <CodeInline
        style={{
          backgroundColor: "rgb(209,213,219)",
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
  );
};

export default () => {
  return (
    <Layout>
      <InlineStyles />
    </Layout>
  );
};
