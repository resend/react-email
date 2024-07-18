import { Button, Heading, Img, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "One product";

export const OneProduct = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section className="my-4">
        <Img
          className="w-full rounded-xl object-cover"
          height={320}
          src="https://images.unsplash.com/photo-1612188842101-f976582906fc?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Section className="mt-8 text-center">
          <Text className="my-4 text-lg font-semibold text-indigo-600">
            Our new product
          </Text>
          <Heading
            as="h1"
            className="text-4xl font-semibold tracking-tight text-gray-900"
          >
            Elegant Comfort
          </Heading>
          <Text className="mt-2 text-base text-gray-500">
            Luxurious, plush seating for a sophisticated and cozy living room
            ambiance
          </Text>
          <Text className="text-base font-semibold text-gray-900">$999.99</Text>
          <Button
            className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Section>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default OneProduct;
