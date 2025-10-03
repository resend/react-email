import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface PlaidVerifyIdentityEmailProps {
  validationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const PlaidVerifyIdentityEmail = ({
  validationCode,
}: PlaidVerifyIdentityEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white font-plaid">
        <Container className="bg-white border border-solid border-[#eee] rounded shadow-[rgba(20,50,70,.2)] shadow-md mt-5 max-w-[360px] mx-auto my-0 pt-17 px-0 pb-33">
          <Img
            src={`${baseUrl}/static/plaid-logo.png`}
            width="212"
            height="88"
            alt="Plaid"
            className="mx-auto my-0"
          />
          <Text className="text-[#0a85ea] text-xs font-bold h-4 tracking-[0] leading-4 mt-4 mb-2 mx-2 uppercase text-center">
            Verify Your Identity
          </Text>
          <Heading className="text-black inline-block text-xl my-0 text-center">
            Enter the following code to finish linking Venmo.
          </Heading>
          <Section className="bg-[rgba(0,0,0,.05)] rounded mx-auto mt-4 mb-3.5 align-middle w-[280px]">
            <Text className="text-black text-3xl font-bold tracking-[6px] leading-10 py-2 mx-auto my-0 block text-center">
              {validationCode}
            </Text>
          </Section>
          <Text className="text-[#444] text-[15px] tracking-[0] py-0 px-10 m-0 text-center">
            Not expecting this email?
          </Text>
          <Text className="text-[#444] text-[15px] tracking-[0] py-0 px-10 m-0 text-center">
            Contact{' '}
            <Link
              href="mailto:login@plaid.com"
              className="text-[#444] underline"
            >
              login@plaid.com
            </Link>{' '}
            if you did not request this code.
          </Text>
        </Container>
        <Text className="text-black text-xs font-extrabold tracking-[0] leading-6 m-0 mt-4 text-center uppercase">
          Securely powered by Plaid.
        </Text>
      </Body>
    </Tailwind>
  </Html>
);

PlaidVerifyIdentityEmail.PreviewProps = {
  validationCode: '144833',
} as PlaidVerifyIdentityEmailProps;

export default PlaidVerifyIdentityEmail;
