import { Body, Container, Font, Head, Html, Tailwind } from "@react-email/components";
import { survey } from "./patterns/marketing/survey";
import { checkout } from "./patterns/marketing/checkout";
import tailwindConfig from "./tailwind.config";

const Marketing = () => {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={400}
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
            format: "woff2",
          }}
        />
      </Head>

      <Tailwind config={tailwindConfig}>
        <Body>
          <Container>
            {checkout}
            {survey}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Marketing;
