import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface LinearLoginCodeEmailProps {
  validationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const LinearLoginCodeEmail = ({
  validationCode,
}: LinearLoginCodeEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white font-linear">
        <Preview>Your login code for Linear</Preview>
        <Container className="mx-auto my-0 max-w-[560px] px-0 pt-5 pb-12">
          <Img
            src={`${baseUrl}/static/linear-logo.png`}
            width="42"
            height="42"
            alt="Linear"
            className="rounded-3xl w-[42px] h-[42px]"
          />
          <Heading className="text-[24px] tracking-[-0.5px] leading-[1.3] font-normal text-[#484848] pt-[17px] px-0 pb-0">
            Your login code for Linear
          </Heading>
          <Section className="py-[27px] px-0">
            <Button
              className="bg-[#5e6ad2] rounded font-semibold text-white text-[15px] no-underline text-center block py-[11px] px-[23px]"
              href="https://linear.app"
            >
              Login to Linear
            </Button>
          </Section>
          <Text className="mb-[15px] mx-0 mt-0 leading-[1.4] text-[15px] text-[#3c4149]">
            This link and code will only be valid for the next 5 minutes. If the
            link does not work, you can use the login verification code
            directly:
          </Text>
          <code className="font-mono font-bold px-1 py-px bg-[#dfe1e4] text-[#3c4149] text-[21px] tracking-[-0.3px] rounded">
            {validationCode}
          </code>
          <Hr className="border-[#dfe1e4] mt-[42px] mb-[26px]" />
          <Link
            href="https://linear.app"
            className="text-[#b4becc] text-[14px]"
          >
            Linear
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

LinearLoginCodeEmail.PreviewProps = {
  validationCode: 'tt226-5398x',
} as LinearLoginCodeEmailProps;

export default LinearLoginCodeEmail;
