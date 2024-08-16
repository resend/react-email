/* eslint-disable react/no-unescaped-entities */
import { Img, Link, Section, Text } from "@react-email/components";

export const component = (
  <Section style={{ marginTop: "16px", marginBottom: "16px" }}>
    <Section
      align="left"
      style={{
        display: "inline-block",
        textAlign: "left",
        width: "100%",
        maxWidth: "250px",
        verticalAlign: "top",
      }}
    >
      <Text
        style={{
          margin: 0,
          fontSize: 16,
          lineHeight: "24px",
          fontWeight: 600,
          color: "rgb(79,70,229)",
        }}
      >
        What's new
      </Text>
      <Text
        style={{
          margin: 0,
          marginTop: "8px",
          fontSize: 20,
          lineHeight: "28px",
          fontWeight: 600,
          color: "rgb(17,24,39)",
        }}
      >
        Versatile Comfort
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 16,
          lineHeight: "24px",
          color: "rgb(107,114,128)",
        }}
      >
        Experience ultimate comfort and versatility with our furniture
        collection, designed to adapt to your ever-changing needs.
      </Text>
      <Link
        href="https://react.email"
        style={{ color: "rgb(79 70 229)", textDecorationLine: "underline" }}
      >
        Read more
      </Link>
    </Section>
    <Section
      align="right"
      style={{
        display: "inline-block",
        marginTop: 8,
        marginBottom: 8,
        width: "100%",
        maxWidth: 220,
        verticalAlign: "top",
      }}
    >
      <Img
        alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
        height={220}
        src="https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        style={{
          borderRadius: 8,
          objectFit: "cover",
        }}
        width={220}
      />
    </Section>
  </Section>
);
