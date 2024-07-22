import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Heading with spacing";

export const HeadingWithSpacing = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Heading as="h4" className="mx-4 my-5">
        Header with margin on all sides
      </Heading>
      <Heading as="h4" className="mx-4 mt-10">
        Header with more margin on top
      </Heading>
      <Heading as="h4" className="mx-4 mb-10">
        Header with more margin on the bottom
      </Heading>
      {/* end pattern code */}
    </Layout>
  );
};

export default HeadingWithSpacing;
