import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Tailwind,
} from "@react-email/components";
import { headerWithSocialIcons } from "./patterns/headers/with-social-icons";
import { headerWithCenteredMenu } from "./patterns/headers/with-centered-menu";
import { headerWithMenu } from "./patterns/headers/with-menu";
import tailwindConfig from "./tailwind.config";

const Headers = () => {
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
            {headerWithSocialIcons}
            {headerWithCenteredMenu}
            {headerWithMenu}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Headers;
