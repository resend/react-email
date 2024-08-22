import { Column, Hr, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Row>
      <Column>First col</Column>
      <Column>Second col</Column>
    </Row>
    <Hr className="m-[16px]" />
    <Row>
      <Column>First col</Column>
      <Column>Second col</Column>
    </Row>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
