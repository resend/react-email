/* eslint-disable react/no-unescaped-entities */
import { Column, Img, Row, Section, Text } from "@react-email/components";

export const pattern = (
  <Section
    style={{
      marginTop: 16,
      marginBottom: 16,
    }}
  >
    <Row>
      <Text
        style={{
          margin: 0,
          fontSize: 20,
          lineHeight: "28px",
          fontWeight: 600,
          color: "rgb(17,24,39)",
        }}
      >
        Elevate Outdoor Living
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 16,
          lineHeight: "24px",
          color: "rgb(107,114,128)",
        }}
      >
        Take your outdoor space to new heights with our premium outdoor
        furniture, designed to elevate your alfresco experience.
      </Text>
    </Row>
    <Row
      style={{
        marginTop: 16,
      }}
    >
      <Column
        colSpan={1}
        style={{
          width: "50%",
          verticalAlign: "baseline",
          paddingRight: 8,
          boxSizing: "border-box",
        }}
      >
        <Img
          alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
          height="180"
          src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          style={{
            width: "100%",
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
        <Text
          style={{
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
            fontSize: 20,
            lineHeight: "28px",
            fontWeight: 600,
            color: "rgb(17,24,39)",
          }}
        >
          Multifunctional Marvels
        </Text>
        <Text
          style={{
            marginBottom: 0,
            marginTop: 8,
            fontSize: 16,
            lineHeight: "24px",
            color: "rgb(107,114,128)",
          }}
        >
          Discover the innovative world of multifunctional furniture, where
          style meets practicality, offering creative solutions for maximizing
          space and enhancing functionality in your home
        </Text>
      </Column>
      <Column
        colSpan={1}
        style={{
          width: "50%",
          verticalAlign: "baseline",
          paddingLeft: 8,
          boxSizing: "border-box",
        }}
      >
        <Img
          alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
          height="180"
          src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          style={{
            width: "100%",
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
        <Text
          style={{
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
            fontSize: 20,
            lineHeight: "28px",
            fontWeight: 600,
            color: "rgb(17,24,39)",
          }}
        >
          Timeless Classics
        </Text>
        <Text
          style={{
            marginBottom: 0,
            marginTop: 8,
            fontSize: 16,
            lineHeight: "24px",
            color: "rgb(107,114,128)",
          }}
        >
          Step into the world of timeless classics as we explore iconic
          furniture pieces that have stood the test of time, adding enduring
          elegance and sophistication to any interior
        </Text>
      </Column>
    </Row>
  </Section>
);