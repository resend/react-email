import { Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Row>
    <Column className="w-1/3">First</Column>
    <Column className="w-1/3">Second</Column>
    <Column className="w-1/3">Third</Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
