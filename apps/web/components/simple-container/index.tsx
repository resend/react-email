import { Container, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Container>
    <Text>
      Hello, I am a container. I keep content centered and maintain it to a
      maximum width while still taking up as much space as possible!
    </Text>
  </Container>
);

export default () => {
  return <Layout>{component}</Layout>;
};
