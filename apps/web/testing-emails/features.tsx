import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Tailwind,
} from "@react-email/components";
import { headerWithFourParagraphs } from "./_patterns/features/header-with-4-paragraphs";
import { headerWithThreeCenteredParagraphs } from "./_patterns/features/header-with-3-centered-paragraphs";
import { headerWithListItems } from "./_patterns/features/header-with-list-items";
import { headerWithNumberedListItems } from "./_patterns/features/header-with-numbered-list-items";
import { headerWithFourParagraphsTwoColumns } from "./_patterns/features/header-with-4-paragraphs-two-columns";
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
            {headerWithFourParagraphs}
            {headerWithThreeCenteredParagraphs}
            {headerWithListItems}
            {headerWithNumberedListItems}
            {headerWithFourParagraphsTwoColumns}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Gallery;
