import { Button, Heading, Img, Section, Text } from "@react-email/components";

export const title = "Article with image";

export const articleWithImage = (
  /* start pattern code */
  <Section className="my-4">
    <Img
      className="w-full rounded-xl object-cover"
      height="320"
      src="https://images.unsplash.com/photo-1702470170564-22dd352f5b88?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />
    <Section className="mt-8 text-center">
      <Text className="my-4 text-lg font-semibold text-indigo-600">
        Our new article
      </Text>
      <Heading
        as="h1"
        className="m-0 mt-2 text-4xl font-semibold text-gray-900"
      >
        Designing with Furniture
      </Heading>
      <Text className="text-base text-gray-500">
        Unleash your inner designer as we explore how furniture plays a vital
        role in creating stunning interiors, offering insights into choosing the
        right pieces, arranging them harmoniously, and infusing your space with
        personality and style
      </Text>
      <Button
        className="mt-4 rounded-lg bg-indigo-600 px-10 py-3 font-semibold text-white"
        href="https://react.email"
      >
        Read more
      </Button>
    </Section>
  </Section>
  /* end pattern code */
);

export default articleWithImage;
