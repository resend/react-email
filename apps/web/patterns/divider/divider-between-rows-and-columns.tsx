import { Column, Hr, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Divider between rows and columns";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Row>
        <Column>
          First col
        </Column>
        <Column>
          Second col
        </Column>
      </Row>
      <Hr className="my-4" />
      <Row>
        <Column>
          First col
        </Column>
        <Column>
          Second col
        </Column>
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
        <Column>
          First col
        </Column>
        <Column>
          Second col
        </Column>
      </Row>
      <Hr style={{ marginTop: 16, marginBottom: 16 }} />
      <Row>
        <Column>
          First col
        </Column>
        <Column>
          Second col
        </Column>
      </Row>
      {/* end pattern code */}
    </Layout>
  );
};

export default InlineStyles;
