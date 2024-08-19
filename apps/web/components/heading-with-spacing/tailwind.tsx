import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Heading as="h4" className="mx-4 my-5">
      Header with margin on all sides
    </Heading>
    <Heading as="h4" className="mx-4 mt-10">
      Header with more margin on top
    </Heading>
    <Heading as="h4" className="mx-4 mb-10">
      Header with more margin on the bottom
    </Heading>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
