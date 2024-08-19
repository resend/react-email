import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component =  (
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

export default () => {
  return <Layout>
    {component}
  </Layout>;
};
