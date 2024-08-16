import { Column, Row } from "@react-email/components";

export const component =  (
  <>
    <Row>
      <Column style={{ width: "50%" }}>First</Column>
      <Column style={{ width: "50%" }}>Second</Column>
    </Row>
    <Row>
      <Column style={{ width: "30%" }}>First</Column>
      <Column style={{ width: "70%" }}>Second</Column>
    </Row>
  </>
);
