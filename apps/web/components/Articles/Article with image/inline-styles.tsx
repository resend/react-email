import { Button, Heading, Img, Section, Text } from "@react-email/components";

export const component = (
  <Section style={{ margin: 16 }}>
    <Img
      alt="A picture of a sunset on a curved road that goes up a mountain with lights of cars smeared from its start to finish. The picture was taken during a sunset, and has some trees all over."
      height="320"
      src="https://images.unsplash.com/photo-1702470170564-22dd352f5b88?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      style={{
        width: "100%",
        borderRadius: 12,
        objectFit: "cover",
      }}
    />
    <Section
      style={{
        marginTop: 32,
        textAlign: "center",
      }}
    >
      <Text
        style={{
          marginTop: 16,
          marginBottom: 16,
          fontSize: 18,
          lineHeight: "28px",
          fontWeight: 600,
          color: "rgb(79,70,229)",
        }}
      >
        Our new article
      </Text>
      <Heading
        as="h1"
        style={{
          margin: 0,
          marginTop: 8,
          fontSize: 36,
          lineHeight: "36px",
          fontWeight: 600,
          color: "rgb(17,24,39)",
        }}
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
        href="https://react.email"
        style={{
          marginTop: 16,
          borderRadius: 8,
          backgroundColor: "rgb(79,70,229)",
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 12,
          paddingBottom: 12,
          fontWeight: 600,
          color: "rgb(255,255,255)",
        }}
      >
        Read more
      </Button>
    </Section>
  </Section>
);
