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
} from "@react-email/components";
import tailwindConfig from "./tailwind.config";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const NotionMagicLinkEmail = ({
  loginCode,
}) => (
  <Html>
    <Tailwind config={tailwindConfig}>
      <Head />
      <Preview>Log in with this magic link</Preview>
      <Body className="bg-white font-sans">
        <Container className="pl-3 pr-3 m-[0_auto]">
          <Heading className="text-gray-700 p-0 font-bold font-sans">
            Login
          </Heading>
          <Link
            className="font-sans text-blue-600 text-sm underline block mb-4"
            href="https://notion.so"
            target="_blank"
          >
            Click here to log in with this magic link
          </Link>
          <Text className="text-gray-700 mb-3.5 font-sans">
            Or, copy and paste this temporary login code:
          </Text>
          <code className="inline-block p-[16px_4.5%] bg-gray-100 rounded-md border border-[1px_solid_#eee] text-gray-700">
            {loginCode}
          </code>
          <Text
            className="text-gray-400 text-sm mt-3.5 mb-4 font-sans"
          >
            If you didn&apos;t try to login, you can safely ignore this email.
          </Text>
          <Text
            className="text-gray-400 font-sans text-sm my-6 mx-0 mt-3 mb-9"
          >
            Hint: You can set a permanent password in Settings & members → My
            account.
          </Text>
          <Img
            alt="Notion's Logo"
            height="32"
            src={`${baseUrl}/static/notion-logo.png`}
            width="32"
          />
          <Text className="text-[#898989] font-sans text-xs leading-6 mb-6">
            <Link
              className="text-[#898989] font-sans text-sm underline"
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
  loginCode: "sparo-ndigo-amurt-secan",
};

export default NotionMagicLinkEmail;

