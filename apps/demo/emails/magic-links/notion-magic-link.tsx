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
      <Body className="bg-white font-notion">
        <Preview>Log in with this magic link</Preview>
        <Container className="px-3 mx-auto">
          <Heading className="text-[#333] text-2xl my-10 mx-0 p-0">
            Login
          </Heading>
          <Link
            href="https://notion.so"
            target="_blank"
            className="text-[#2754C5] text-sm underline mb-4 block"
          >
            Click here to log in with this magic link
          </Link>
          <Text className="text-[#333] text-sm my-6 mb-3.5">
            Or, copy and paste this temporary login code:
          </Text>
          <code className="inline-block py-4 px-[4.5%] w-9/10 bg-[#f4f4f4] rounded-md border border-solid border-[#eee] text-[#333]">
            {loginCode}
          </code>
          <Text className="text-[#ababab] text-sm mt-3.5 mb-4">
            If you didn&apos;t try to login, you can safely ignore this email.
          </Text>
          <Text className="text-[#ababab] text-sm mt-3.5 mb-9.5">
            Hint: You can set a permanent password in Settings & members → My
            account.
          </Text>
          <Img
            src={`${baseUrl}/static/notion-logo.png`}
            width="32"
            height="32"
            alt="Notion's Logo"
          />
          <Text className="text-[#898989] text-xs mt-3 mb-6">
            <Link
              href="https://notion.so"
              target="_blank"
              className="text-[#898989] text-sm underline"
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
