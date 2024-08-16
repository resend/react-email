import { Heading } from "@react-email/components";

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
