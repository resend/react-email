import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Single heading";

export const None = () => {
  return <Heading>Simple h1 heading</Heading>;
};

export default () => (
  <Layout>
    <None />
  </Layout>
);
