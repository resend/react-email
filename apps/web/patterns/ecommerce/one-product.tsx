import { Button, Heading, Img, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "One product";

export const Tailwind = () => {
  return (
    <Section className="my-4">
      <Img
        alt="A picture on nice dark carpet of various black items laid out. The items include: a box that has text that reads 'BLVCK, Paris', a bottle, some flip flops and two six-sided dices."
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
  );
};

export const InlineStyles = () => {
  return (
    <Section className="my-4">
      <Img
        alt="A picture on nice dark carpet of various black items laid out. The items include: a box that has text that reads 'BLVCK, Paris', a bottle, some flip flops and two six-sided dices."
        height={320}
        src="https://images.unsplash.com/photo-1612188842101-f976582906fc?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        style={{
          width: "100%",
          borderRadius: 12,
          objectFit: "cover",
        }}
      />
      <Section style={{ marginTop: 32, textAlign: "center" }}>
        <Text
          style={{
            marginTop: 16,
            fontSize: 18,
            lineHeight: "28px",
            fontWeight: 600,
            color: "rgb(79,70,229)",
          }}
        >
          Our new product
        </Text>
        <Heading
          as="h1"
          style={{
            fontSize: 36,
            lineHeight: "36px",
            fontWeight: 600,
            letterSpacing: 0.4,
            color: "rgb(17,24,39)",
          }}
        >
          Elegant Comfort
        </Heading>
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            lineHeight: "24px",
            color: "rgb(107,114,128)",
          }}
        >
          Luxurious, plush seating for a sophisticated and cozy living room
          ambiance
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 600,
            color: "rgb(17,24,39)",
          }}
        >
          $999.99
        </Text>
        <Button
          href="https://react.email"
          style={{
            marginTop: 16,
            borderRadius: 8,
            backgroundColor: "rgb(79,70,229)",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 12,
            paddingBottom: 12,
            fontWeight: 600,
            color: "rgb(255,255,255)",
          }}
        >
          Buy
        </Button>
      </Section>
    </Section>
  );
};

export default () => {
  return (
    <Layout>
      <InlineStyles />
    </Layout>
  );
};
