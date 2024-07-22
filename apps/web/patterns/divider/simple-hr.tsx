import { Hr, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple Hr";

export const SimpleHr = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text>Before hr</Text>
      <Hr className="my-4 border-t-2"/>
      <Text>After hr</Text>
      {/* end pattern code */}
    </Layout>
  );
};

export default SimpleHr;
