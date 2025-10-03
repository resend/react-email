import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface KoalaWelcomeEmailProps {
  userFirstname: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const KoalaWelcomeEmail = ({
  userFirstname,
}: KoalaWelcomeEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white font-koala">
        <Preview>
          The sales intelligence platform that helps you uncover qualified
          leads.
        </Preview>
        <Container className="mx-auto py-5 pb-12">
          <Img
            src={`${baseUrl}/static/koala-logo.png`}
            width="170"
            height="50"
            alt="Koala"
            className="mx-auto"
          />
          <Text className="text-base leading-7">Hi {userFirstname},</Text>
          <Text className="text-base leading-7">
            Welcome to Koala, the sales intelligence platform that helps you
            uncover qualified leads and close deals faster.
          </Text>
          <Section className="text-center">
            <Button
              className="bg-[#5F51E8] rounded text-white text-base no-underline text-center block p-3"
              href="https://getkoala.com"
            >
              Get started
            </Button>
          </Section>
          <Text className="text-base leading-7">
            Best,
            <br />
            The Koala team
          </Text>
          <Hr className="border-[#cccccc] my-5" />
          <Text className="text-[#8898aa] text-xs">
            470 Noor Ave STE B #1148, South San Francisco, CA 94080
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

KoalaWelcomeEmail.PreviewProps = {
  userFirstname: 'Alan',
} as KoalaWelcomeEmailProps;

export default KoalaWelcomeEmail;
