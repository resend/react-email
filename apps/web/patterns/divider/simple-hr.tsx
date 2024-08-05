import { Hr, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple Hr";

export const Tailwind = () => {
  return (
    <>
      <Text>Before hr</Text>
      <Hr className="my-4 border-t-2" />
      <Text>After hr</Text>
    </>
  );
};

export const InlineStyles = () => {
  return (
    <>
      <Text>Before hr</Text>
      <Hr style={{ marginTop: 16, marginBottom: 16, borderTopWidth: 2 }} />
      <Text>After hr</Text>
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
