import { Column, Hr, Row } from "@react-email/components";

export const component = (
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
