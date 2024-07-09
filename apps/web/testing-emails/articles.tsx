import { Body, Container, Head, Html, Tailwind } from "@react-email/components";
import tailwindConfig from "./tailwind.config";
import { articleWithImage } from "./patterns/articles/article-with-image";

const Articles = () => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans antialiased">
          <Container className="my-10 rounded">
            {articleWithImage}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Articles;
