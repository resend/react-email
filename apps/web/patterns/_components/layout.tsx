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
  noTailwind = false,
}: {
  children?: React.ReactNode;
  noTailwind?: boolean;
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

      {noTailwind ? (
        <Body>
          <Container>{children}</Container>
        </Body>
      ) : (
        <Tailwind config={tailwindConfig}>
          <Body>
            <Container>{children}</Container>
          </Body>
        </Tailwind>
      )}
    </Html>
  );
};
