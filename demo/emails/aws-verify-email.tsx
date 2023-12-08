import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AWSVerifyEmailProps {
  verificationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export default function AWSVerifyEmail({
  verificationCode = "596853",
}: AWSVerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>AWS Email Verification</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ backgroundColor: "#fff" }}>
            <Section
              style={{
                backgroundColor: "#252f3d",
                display: "flex",
                padding: "20px 0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Img
                src={`${baseUrl}/static/aws-logo.png`}
                width="75"
                height="45"
                alt="Notion's Logo"
              />
            </Section>
            <Section style={{ padding: "25px 35px" }}>
              <Heading style={h1}>Verify your email address</Heading>
              <Text
                style={{ ...text, marginBottom: "14px", lineHeight: "140%" }}
              >
                Thanks for starting the new AWS account creation process. We
                want to make sure it's really you. Please enter the following
                verification code when prompted. If you don&apos;t want to
                create an account, you can ignore this message.
              </Text>
              <Section
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    ...text,
                    margin: 0,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Verification code
                </Text>
                <Text
                  style={{
                    ...text,
                    fontWeight: "bold",
                    fontSize: 36,
                    margin: "10px 0",
                    textAlign: "center",
                  }}
                >
                  {verificationCode}
                </Text>
                <Text style={{ ...text, margin: 0, textAlign: "center" }}>
                  (This code is valid for 10 minutes)
                </Text>
              </Section>
            </Section>
            <Hr />
            <Section style={{ padding: "25px 35px", lineHeight: "140%" }}>
              <Text style={{ ...text, margin: 0 }}>
                Amazon Web Services will never email you and ask you to disclose
                or verify your password, credit card, or banking account number.
              </Text>
            </Section>
          </Section>
          <Text
            style={{
              ...text,
              fontSize: 12,
              lineHeight: 1.4,
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            This message was produced and distributed by Amazon Web Services,
            Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web
            Services, Inc.. All rights reserved. AWS is a registered trademark
            of{" "}
            <Link href="https://amazon.com" target="_blank" style={{ ...link }}>
              Amazon.com
            </Link>
            , Inc. View our{" "}
            <Link href="https://amazon.com" target="_blank" style={{ ...link }}>
              privacy policy
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};
