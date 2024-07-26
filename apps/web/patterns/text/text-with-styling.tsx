import { Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Text with styling";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text className="text-indigo-400 text-2xl font-semibold">
        Amazing content
      </Text>
      <Text>
        This is the actual content that the accented text above refers to.
      </Text>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text
        style={{
          color: "rgb(129,140,248)",
          fontSize: 24,
          lineHeight: 32,
          fontWeight: 600,
        }}
      >
        Amazing content
      </Text>
      <Text>
        This is the actual content that the accented text above refers to.
      </Text>
      {/* end pattern code */}
    </Layout>
  );
};

export default InlineStyles;
