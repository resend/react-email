import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Text,
} from "@react-email/components";

export const title = "Simple container";

export const SimpleContainer = () => {
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

      <Body>
        {/* start pattern code */}
        <Container>
          <Text>
            Hello, I am a container. I keep content centered and maintain it to
            a maximum width while still taking up as much space as possible!
          </Text>
        </Container>
        {/* end pattern code */}
      </Body>
    </Html>
  );
};

export default SimpleContainer;
