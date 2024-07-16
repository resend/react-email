import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Tailwind,
} from "@react-email/components";
import { imagesWithVerticalGrid } from "./_patterns/gallery/images-with-vertical-grid";
import { gridWith4Images } from "./_patterns/gallery/grid-with-4-images";
import { threeColumnsWithImages } from "./_patterns/gallery/3-columns-with-images";
import { imagesOnHorizontalGrid } from "./_patterns/gallery/images-on-horizontal-grid";
import tailwindConfig from "./tailwind.config";

const Gallery = () => {
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
            {imagesWithVerticalGrid}
            {gridWith4Images}
            {threeColumnsWithImages}
            {imagesOnHorizontalGrid}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Gallery;
