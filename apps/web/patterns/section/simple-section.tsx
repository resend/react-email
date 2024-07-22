import { Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple section";

export const SimpleSection = () => {
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

export default SimpleSection;
