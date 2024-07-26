import {
  Html,
  Head,
  Tailwind,
  Body,
  Container,
  Font,
} from "@react-email/components";
import tailwindConfig from "../tailwind.config";

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Html>
      <Tailwind config={tailwindConfig}>
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
          <Container>{children}</Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
