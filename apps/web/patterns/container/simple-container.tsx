import { Container, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple container";

export const None = () => {
  return (
      <Container>
        <Text>
          Hello, I am a container. I keep content centered and maintain it to a
          maximum width while still taking up as much space as possible!
        </Text>
      </Container>
  );
};

export default () => <Layout><None/></Layout>;
