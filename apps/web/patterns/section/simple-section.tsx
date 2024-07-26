import { Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple section";

export const None = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section>
        <Text>Hello my section!</Text>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default None;
