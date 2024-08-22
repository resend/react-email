import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Heading as="h4" className="mx-[16px] my-[20px]">
      Header with margin on all sides
    </Heading>
    <Heading as="h4" className="mx-[16px] mt-[4px]">
      Header with more margin on top
    </Heading>
    <Heading as="h4" className="mx-[16px] mb-[40px]">
      Header with more margin on the bottom
    </Heading>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
