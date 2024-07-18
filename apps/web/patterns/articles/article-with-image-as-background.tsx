import { Button, Heading, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Article with image as background";

// Notes for future exploration on finding a way to do this inside of
// Desktop Outlook:
// - https://backgrounds.cm/
// - use VML https://learn.microsoft.com/en-us/windows/win32/vml/msdn-online-vml-fill-element
export const ArticleWithImageAsBackground = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section
        className="h-[424px] my-4 rounded-xl bg-blue-600"
        style={{
          // This image must be in quotes for Yahoo
          backgroundImage: "url('/static/my-image.png')",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="bottom-0 left-0 right-0 top-[15%] mx-auto my-auto p-10 text-center">
          <Text className="m-0 font-semibold text-gray-200">New article</Text>
          <Heading as="h1" className="m-0 mt-1 font-bold text-white">
            Artful Accents
          </Heading>
          <Text className="m-0 mt-2 text-base font-bold text-white">
            Uncover the power of accent furniture in transforming your space
            with subtle touches of style, personality, and functionality, as we
            explore the art of curating captivating accents for a truly curated
            home
          </Text>
          <Button
            className="mt-6 rounded-lg border border-solid border-gray-200 bg-white px-10 py-3 font-semibold text-gray-900"
            href="#"
          >
            Read more
          </Button>
        </div>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default ArticleWithImageAsBackground;
