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
        {(() => {
          const container = (
            <Container
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                height: "40rem"
              }}
            >
              {children}
            </Container>
          );

          if (withTailwind) {
            return <Tailwind config={tailwindConfig}>{container}</Tailwind>;
          }

          return container;
        })()}
      </Body>
    </Html>
  );
};
