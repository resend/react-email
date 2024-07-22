import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Single heading";

export const SingleHeading = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Heading>Simple h1 heading</Heading>
      {/* end pattern code */}
    </Layout>
  );
};

export default SingleHeading;
