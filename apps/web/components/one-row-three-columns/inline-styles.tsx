import { Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Row>
    <Column style={{ width: "33.333%" }}>First</Column>
    <Column style={{ width: "33.333%" }}>Second</Column>
    <Column style={{ width: "33.333%" }}>Third</Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
