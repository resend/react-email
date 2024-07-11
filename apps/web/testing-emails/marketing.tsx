import { Body, Container, Head, Html, Tailwind } from "@react-email/components";
import { survey } from "./patterns/marketing/survey";
import tailwindConfig from "./tailwind.config";

const Marketing = () => {
  return (
    <Html>
      <Head />

      <Tailwind config={tailwindConfig}>
        <Body>
          <Container>
            {survey}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Marketing;
