import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const StripeWelcomeEmail = () => (
  <Html>
    <Head />
    <Preview>You're now ready to make live transactions with Stripe!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            alt="Stripe"
            height="21"
            src={`${baseUrl}/static/stripe-logo.png`}
            width="49"
          />
          <Hr style={hr} />
          <Text style={paragraph}>
            Thanks for submitting your account information. You're now ready to
            make live transactions with Stripe!
          </Text>
          <Text style={paragraph}>
            You can view your payments and a variety of other information about
            your account right from your dashboard.
          </Text>
          <Button href="https://dashboard.stripe.com/login" style={button}>
            View your Stripe Dashboard
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            If you haven't finished your integration, you might find our{" "}
            <Link href="https://stripe.com/docs" style={anchor}>
              docs
            </Link>{" "}
            handy.
          </Text>
          <Text style={paragraph}>
            Once you're ready to start accepting payments, you'll just need to
            use your live{" "}
            <Link
              href="https://dashboard.stripe.com/login?redirect=%2Fapikeys"
              style={anchor}
            >
              API keys
            </Link>{" "}
            instead of your test API keys. Your account can simultaneously be
            used for both test and live requests, so you can continue testing
            while accepting live payments. Check out our{" "}
            <Link href="https://stripe.com/docs/dashboard" style={anchor}>
              tutorial about account basics
            </Link>
            .
          </Text>
          <Text style={paragraph}>
            Finally, we've put together a{" "}
            <Link
              href="https://stripe.com/docs/checklist/website"
              style={anchor}
            >
              quick checklist
            </Link>{" "}
            to ensure your website conforms to card network standards.
          </Text>
          <Text style={paragraph}>
            We'll be here to help you with any step along the way. You can find
            answers to most questions and get in touch with us on our{" "}
            <Link href="https://support.stripe.com/" style={anchor}>
              support site
            </Link>
            .
          </Text>
          <Text style={paragraph}>— The Stripe team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default StripeWelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left",
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
