import { Container, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple container";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Container>
        <Text>
          Hello, I am a container. I keep content centered and maintain it to a
          maximum width while still taking up as much space as possible!
        </Text>
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
        <Text>
          Hello, I am a container. I keep content centered and maintain it to a
          maximum width while still taking up as much space as possible!
        </Text>
      </Container>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;
