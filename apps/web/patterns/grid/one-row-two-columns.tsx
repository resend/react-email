import { Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "1 row, 2 columns";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Row>
        <Column className="w-1/2">First</Column>
        <Column className="w-1/2">Second</Column>
      </Row>
      <Row>
        <Column className="w-[30%]">First</Column>
        <Column className="w-[70%]">Second</Column>
      </Row>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Row>
        <Column style={{ width: "50%" }}>First</Column>
        <Column style={{ width: "50%" }}>Second</Column>
      </Row>
      <Row>
        <Column style={{ width: "30%" }}>First</Column>
        <Column style={{ width: "70%" }}>Second</Column>
      </Row>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;
