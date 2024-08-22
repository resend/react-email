import {
  Html,
  Head,
  Tailwind,
  Body,
  Container,
  Font,
} from "@react-email/components";
import tailwindConfig from "../tailwind.config";

export const Layout = ({
  children,
  withTailwind = true,
}: {
  children?: React.ReactNode;
  withTailwind?: boolean;
}) => {
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
        {withTailwind ? (
          <Tailwind config={tailwindConfig}>
            <Container
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                height: "100vh",
              }}
            >
              {children}
            </Container>
          </Tailwind>
        ) : (
          <Container
            style={{ marginLeft: "auto", marginRight: "auto", height: "100vh" }}
          >
            {children}
          </Container>
        )}
      </Body>
    </Html>
  );
};
