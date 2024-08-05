import { Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple section";

export const None = () => {
  return (
    <Section>
      <Text>Hello my section!</Text>
    </Section>
  );
};

export default () => (
  <Layout>
    <None />
  </Layout>
);
