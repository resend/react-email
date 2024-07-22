import { Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Text with styling";

export const TextWithStyling = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text className="text-indigo-400 text-2xl font-semibold">Amazing content</Text>
      <Text>This is the actual content that the accented text above refers to.</Text>
      {/* end pattern code */}
    </Layout>
  );
};

export default TextWithStyling;
