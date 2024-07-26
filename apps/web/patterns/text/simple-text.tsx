import { Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple text";

export const None = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text>A simple paragraph</Text>
      {/* end pattern code */}
    </Layout>
  );
};

export default None;
