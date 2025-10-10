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
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface RaycastMagicLinkEmailProps {
  magicLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const RaycastMagicLinkEmail = ({
  magicLink,
}: RaycastMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white font-raycast">
        <Preview>Log in with this magic link.</Preview>
        <Container className="mx-auto my-0 pt-5 px-[25px] pb-12 bg-[url('/static/raycast-bg.png')] [background-position:bottom] [background-repeat:no-repeat]">
          <Img
            src={`${baseUrl}/static/raycast-logo.png`}
            width={48}
            height={48}
            alt="Raycast"
          />
          <Heading className="text-[28px] font-bold mt-12">
            🪄 Your magic link
          </Heading>
          <Section className="my-6 mx-0">
            <Text className="text-base leading-6.5">
              <Link className="text-[#FF6363]" href={magicLink}>
                👉 Click here to sign in 👈
              </Link>
            </Text>
            <Text className="text-base leading-6.5">
              If you didn't request this, please ignore this email.
            </Text>
          </Section>
          <Text className="text-base leading-6.5">
            Best,
            <br />- Raycast Team
          </Text>
          <Hr className="border-[#dddddd] mt-12" />
          <Img
            src={`${baseUrl}/static/raycast-logo.png`}
            width={32}
            height={32}
            style={{
              WebkitFilter: 'grayscale(100%)',
            }}
            className="[filter:grayscale(100%)] my-5 mx-0"
          />
          <Text className="text-[#8898aa] text-xs leading-6 ml-1">
            Raycast Technologies Inc.
          </Text>
          <Text className="text-[#8898aa] text-xs leading-6 ml-1">
            2093 Philadelphia Pike #3222, Claymont, DE 19703
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

RaycastMagicLinkEmail.PreviewProps = {
  magicLink: 'https://raycast.com',
} as RaycastMagicLinkEmailProps;

export default RaycastMagicLinkEmail;
