import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import tailwindConfig from "./tailwind.config";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const paragraphClassnames = "text-gray-600 text-base font-[HelveticaNeue,Helvetica,Arial,sans-serif] tracking-[0] leading-6 p-[0_40px] m-0 text-center";

export const PlaidVerifyIdentityEmail = ({
  validationCode,
}) => (
  <Html>
    <Tailwind config={tailwindConfig}>
      <Head />
      <Body className="bg-white font-[HelveticaNeue,Helvetica,Arial,sans-serif]">
        <Container className="bg-white border-[1px_solid_#eee] rounded-md shadow-[0_5px_10px_rgba(20,50,70,.2)] mt-5 max-w-[360px] m-[0_auto] p-[68px_0_130px]">
          <Img
            alt="Plaid"
            className="m-[0_auto]"
            height="88"
            src={`${baseUrl}/static/plaid-logo.png`}
            width="212"
          />
          <Text className="text-blue-500 text-xs font-bold font-[HelveticaNeue,Helvetica,Arial,sans-serif] h-4 tracking-[0] leading-4 m-[16px_8px_8px_8px] uppercase text-center">
            Verify Your Identity
          </Text>
          <Heading className="text-black inline-block font-[HelveticaNeue,Helvetica,Arial,sans-serif] text-xl font-medium text-center mt-0 mb-0 leading-6">
            Enter the following code to finish linking Venmo.
          </Heading>
          <Section className="bg-[rgba(0,0,0,.05)] rounded m-[16px_auto_14px] align-middle w-[280px]">
            <Text className="text-black inline-block font-[HelveticaNeue-Bold] text-3xl font-bold tracking-[6px] leading-10 pb-2 py-2 m-[0_auto] w-full text-center">
              {validationCode}
            </Text>
          </Section>
          <Text className={paragraphClassnames}>Not expecting this email?</Text>
          <Text className={paragraphClassnames}>
            Contact{" "}
            <Link className="text-gray-600 underline" href="mailto:login@plaid.com">
              login@plaid.com
            </Link>{" "}
            if you did not request this code.
          </Text>
        </Container>
        {/* The classes that correspond to the styles of footer that work only because of the config on ./tailwind.config.ts */}
        <Text 
          className="text-black text-xs font-extrabold tracking-[0] leading-6 m-0 mt-5 font-[HelveticaNeue,Helvetica,Arial,sans-serif] uppercase text-center"
        >Securely powered by Plaid.</Text>
      </Body>
    </Tailwind>
  </Html>
);

PlaidVerifyIdentityEmail.PreviewProps = {
  validationCode: "144833",
};

export default PlaidVerifyIdentityEmail;
