import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface GithubAccessTokenEmailProps {
  username?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const GithubAccessTokenEmail = ({
  username,
}: GithubAccessTokenEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white text-[#24292e] font-github">
        <Preview>
          A fine-grained personal access token has been added to your account
        </Preview>
        <Container className="max-w-[480px] mx-auto my-0 pt-5 pb-12 px-0">
          <Img
            src={`${baseUrl}/static/github.png`}
            width="32"
            height="32"
            alt="Github"
          />
          
          <Text className="text-[24px] leading-[1.25]">
            <strong>@{username}</strong>, a personal access was created on your
            account.
          </Text>

          <Section className="p-6 text-sm leading-[24px] border border-solid border-[#dedede] rounded text-center">
            <Text className="mb-[10px] mt-0 text-left">
              Hey <strong>{username}</strong>!
            </Text>
            <Text className="mb-[10px] mt-0 text-left">
              A fine-grained personal access token (<Link>resend</Link>) was
              recently added to your account.
            </Text>

            <Button className="text-sm bg-[#28a745] text-white leading-normal rounded-lg py-3 px-6">
              View your token
            </Button>
          </Section>
          <Text className="text-center">
            <Link className="text-[#0366d6] text-xs">
              Your security audit log
            </Link>{' '}
            ・ <Link className="text-[#0366d6] text-xs">Contact support</Link>
          </Text>

          <Text className="text-[#6a737d] text-xs leading-[24px] text-center mt-[60px] mb-4">
            GitHub, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

GithubAccessTokenEmail.PreviewProps = {
  username: 'alanturing',
} as GithubAccessTokenEmailProps;

export default GithubAccessTokenEmail;
