import { Hr, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple Hr";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text>Before hr</Text>
      <Hr className="my-4 border-t-2" />
      <Text>After hr</Text>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text>Before hr</Text>
      <Hr style={{ marginTop: 16, marginBottom: 16, borderTopWidth: 2 }} />
      <Text>After hr</Text>
      {/* end pattern code */}
    </Layout>
  );
};

export default InlineStyles;
