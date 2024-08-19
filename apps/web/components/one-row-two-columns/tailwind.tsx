import { Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Row>
      <Column className="w-1/2">First</Column>
      <Column className="w-1/2">Second</Column>
    </Row>
    <Row>
      <Column className="w-[30%]">First</Column>
      <Column className="w-[70%]">Second</Column>
    </Row>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
