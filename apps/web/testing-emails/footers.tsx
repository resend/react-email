import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Tailwind,
} from "@react-email/components";
import { footerWithTwoColumns } from "./patterns/footers/two-columns";
import { footerWithOneColumn } from "./patterns/footers/one-column";
import tailwindConfig from "./tailwind.config";

const Footers = () => {
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
            {footerWithOneColumn}
            {footerWithTwoColumns}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Footers;
