import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Single heading";

export const None = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Heading>Simple h1 heading</Heading>
      {/* end pattern code */}
    </Layout>
  );
};

export default None;
