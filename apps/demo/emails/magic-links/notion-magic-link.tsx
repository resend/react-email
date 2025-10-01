import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface NotionMagicLinkEmailProps {
  loginCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const NotionMagicLinkEmail = ({
  loginCode,
}: NotionMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white">
        <Preview>Log in with this magic link</Preview>
        <Container className="px-3 mx-auto">
          <Heading className="font-sans text-2xl font-bold text-[#333] my-10 p-0">
            Login
          </Heading>
          <Link
            href="https://notion.so"
            target="_blank"
            className="text-[#2754C5] font-sans text-sm underline block mb-4"
          >
            Click here to log in with this magic link
          </Link>
          <Text className="text-[#333] font-sans text-sm my-6 mb-3.5">
            Or, copy and paste this temporary login code:
          </Text>
          <code className="inline-block py-4 px-[4.5%] w-[90.5%] bg-[#f4f4f4] rounded-md border border-[#eee] text-[#333]">
            {loginCode}
          </code>

          <Text className="text-[#ababab] mt-3.5 mb-4 font-sans text-sm">
            If you didn&apos;t try to login, you can safely ignore this email.
          </Text>
          <Text className="text-[#ababab] mt-3 mb-[38px] font-sans text-sm">
            Hint: You can set a permanent password in Settings & members → My
            account.
          </Text>
          <Img
            src={`${baseUrl}/static/notion-logo.png`}
            width="32"
            height="32"
            alt="Notion's Logo"
          />
          <Text className="text-[#898989] mt-3 mb-[22px] font-sans text-sm">
            <Link
              className="text-[#898989] underline font-sans text-sm"
              href="https://notion.so"
              target="_blank"
            >
              Notion.so
            </Link>
            , the all-in-one-workspace
            <br />
            for your notes, tasks, wikis, and databases.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

NotionMagicLinkEmail.PreviewProps = {
  loginCode: 'sparo-ndigo-amurt-secan',
} as NotionMagicLinkEmailProps;

export default NotionMagicLinkEmail;
