import { Body, Container, Head, Html, Tailwind } from "@react-email/components";
import tailwindConfig from "./tailwind.config";
import { articleWithTwoCards } from "./patterns/articles/article-with-two-cards";
import { articleWithImageAsBackground } from "./patterns/articles/article-with-image-as-background";

const Articles = () => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans antialiased">
          <Container>
            {articleWithTwoCards}
            {articleWithImageAsBackground}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Articles;
