import { Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Text with styling";

export const Tailwind = () => {
  return (
    <>
      <Text className="text-2xl font-semibold text-indigo-400">
        Amazing content
      </Text>
      <Text>
        This is the actual content that the accented text above refers to.
      </Text>
    </>
  );
};

export const InlineStyles = () => {
  return (
    <>
      <Text
        style={{
          color: "rgb(129,140,248)",
          fontSize: 24,
          lineHeight: "32px",
          fontWeight: 600,
        }}
      >
        Amazing content
      </Text>
      <Text>
        This is the actual content that the accented text above refers to.
      </Text>
    </>
  );
};

export default () => {
  return (
    <Layout>
      <InlineStyles />
    </Layout>
  );
};
