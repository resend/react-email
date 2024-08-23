import { Container, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Container style={{ backgroundColor: "#93989C" }}>
    <Text style={{ color: "white", padding: "0 12px" }}>
      Hello, I am a container. I keep content centered and maintain it to a
      maximum width while still taking up as much space as possible!
    </Text>
  </Container>
);

export default () => {
  return <Layout>{component}</Layout>;
};
