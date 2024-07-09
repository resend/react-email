import { Body, Container, Head, Html, Tailwind } from "@react-email/components";
import tailwindConfig from "./tailwind.config";
import { articleWithImage } from "./patterns/articles/article-with-image";
import { articleWithImageOnRight } from "./patterns/articles/article-with-image-on-right";

const Articles = () => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans antialiased">
          <Container>
            {articleWithImage}
            {articleWithImageOnRight}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Articles;
