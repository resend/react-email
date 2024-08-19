import { Column, Hr, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component =  (
  <>
    <Row>
      <Column>First col</Column>
      <Column>Second col</Column>
    </Row>
    <Hr style={{ marginTop: 16, marginBottom: 16 }} />
    <Row>
      <Column>First col</Column>
      <Column>Second col</Column>
    </Row>
  </>
);

export default () => {
  return (
    <Layout>
      {component}
    </Layout>
  );
};
