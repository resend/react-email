import { Heading } from "@react-email/components";

export const pattern = (
  <>
    <Heading
      as="h4"
      style={{
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 20,
        marginTop: 20,
      }}
    >
      Header with margin on all sides
    </Heading>
    <Heading
      as="h4"
      style={{
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 40,
        marginTop: 40,
      }}
    >
      Header with more margin on top
    </Heading>
    <Heading
      as="h4"
      style={{
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 40,
        marginTop: 40,
      }}
    >
      Header with more margin on the bottom
    </Heading>
  </>
);
