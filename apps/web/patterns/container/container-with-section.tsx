import {
  Button,
  Column,
  Container,
  Img,
  Row,
  Section,
} from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Container with section";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Container>
        <Section>
          <Row>
            <Column>This is something amazing</Column>
            <Column align="right">
              <Img src="/static/logo-without-background.png" />
            </Column>
          </Row>
        </Section>

        <Section align="center" className="my-4">
          <Button
            className="bg-indigo-600 text-white w-full px-6 box-border py-3 text-center rounded-md"
            href="https://react.email"
          >
            See more
          </Button>
        </Section>
      </Container>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Container>
        <Section>
          <Row>
            <Column>This is something amazing</Column>
            <Column align="right">
              <Img src="/static/logo-without-background.png" />
            </Column>
          </Row>
        </Section>

        <Section align="center" style={{ marginTop: 16, marginBottom: 16 }}>
          <Button
            href="https://react.email"
            style={{
              backgroundColor: "rgb(79,70,229)",
              color: "rgb(255,255,255)",
              width: "100%",
              paddingLeft: 24,
              paddingRight: 24,
              boxSizing: "border-box",
              paddingTop: 12,
              paddingBottom: 12,
              textAlign: "center",
              borderRadius: 6,
            }}
          >
            See more
          </Button>
        </Section>
      </Container>
      {/* end pattern code */}
    </Layout>
  );
};

export default InlineStyles;
