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
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const paragraphClassname = "text-gray-600 text-base text-left";

export const StripeWelcomeEmail = () => (
  <Html>
    <Tailwind>
      <Head />
      <Preview>You're now ready to make live transactions with Stripe!</Preview>
      <Body className="bg-gray-100 font-sans">
        <Container className="bg-white m-[0_auto] p-[20px_0_48px] mb-16">
          <Section className="p-[0_48px]">
            <Img
              alt="Stripe"
              height="21"
              src={`${baseUrl}/static/stripe-logo.png`}
              width="49"
            />
            <Hr className="border-gray-300 m-[20px_0]" />
            <Text className={paragraphClassname}>
              Thanks for submitting your account information. You're now ready
              to make live transactions with Stripe!
            </Text>
            <Text className={paragraphClassname}>
              You can view your payments and a variety of other information
              about your account right from your dashboard.
            </Text>
            <Button
              className="bg-[#656ee8] rounded-md text-white text-base font-bold decoration-transparent text-center block wfull p-2.5"
              href="https://dashboard.stripe.com/login"
            >
              View your Stripe Dashboard
            </Button>
            <Hr className="border-gray-300 m-[20px_0]" />
            <Text className={paragraphClassname}>
              If you haven't finished your integration, you might find our{" "}
              <Link className="text-[#556cd6]" href="https://stripe.com/docs">
                docs
              </Link>{" "}
              handy.
            </Text>
            <Text className={paragraphClassname}>
              Once you're ready to start accepting payments, you'll just need to
              use your live{" "}
              <Link
                className="text-[#556cd6]"
                href="https://dashboard.stripe.com/login?redirect=%2Fapikeys"
              >
                API keys
              </Link>{" "}
              instead of your test API keys. Your account can simultaneously be
              used for both test and live requests, so you can continue testing
              while accepting live payments. Check out our{" "}
              <Link className="text-[#556cd6]" href="https://stripe.com/docs/dashboard">
                tutorial about account basics
              </Link>
              .
            </Text>
            <Text className={paragraphClassname}>
              Finally, we've put together a{" "}
              <Link
                className="text-[#556cd6]"
                href="https://stripe.com/docs/checklist/website"
              >
                quick checklist
              </Link>{" "}
              to ensure your website conforms to card network standards.
            </Text>
            <Text className={paragraphClassname}>
              We'll be here to help you with any step along the way. You can
              find answers to most questions and get in touch with us on our{" "}
              <Link className="text-[#556cd6]" href="https://support.stripe.com/">
                support site
              </Link>
              .
            </Text>
            <Text className={paragraphClassname}>— The Stripe team</Text>
            <Hr className="border-gray-300 m-[20px_0]" />
            <Text className="text-gray-600 text-xs">
              Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default StripeWelcomeEmail;

