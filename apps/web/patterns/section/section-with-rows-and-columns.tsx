import { Column, Row, Section } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Section with rows and columns";

export const SingleHeading = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section>
        <Row>
          <Column>Column 1, Row 1</Column>
          <Column>Column 2, Row 1</Column>
        </Row>
        <Row>
          <Column>Column 1, Row 2</Column>
          <Column>Column 2, Row 2</Column>
        </Row>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default SingleHeading;
