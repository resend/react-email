import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Tailwind,
} from "@react-email/components";
import { oneProductImageLeft } from "./_patterns/ecommerce/one-product-image-left";
import { oneProduct } from "./_patterns/ecommerce/one-product";
import { titleThreeCardsRow } from "./_patterns/ecommerce/title-three-cards-row";
import { titleFourCards } from "./_patterns/ecommerce/title-four-cards";
import tailwindConfig from "./tailwind.config";

const Buttons = () => {
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
        <Body className="bg-white font-sans antialiased">
          <Container>
            {oneProductImageLeft}
            {oneProduct}
            {titleThreeCardsRow}
            {titleFourCards}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Buttons;
