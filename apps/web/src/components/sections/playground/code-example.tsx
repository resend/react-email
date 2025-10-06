import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

const WelcomeEmail = ({
  username = 'Nicole',
  company = 'Helix',
}: WelcomeEmailProps) => {
  const previewText = `Welcome to ${company}, ${username}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-black font-sans antialiased">
          <Container className="mb-10 mx-auto p-5 w-[465px]">
            <Section className="mt-10">
              <Img
                src={`${baseUrl}/brand/example-logo.png`}
                width="60"
                height="60"
                alt="Logo Example"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-2xl text-white font-normal text-center p-0 my-8 mx-0">
              Welcome to <strong>{company}</strong>, {username}!
            </Heading>
            <Text className="text-start text-sm text-white">
              Hello {username},
            </Text>
            <Text className="text-start text-sm text-white leading-relaxed">
              We're excited to have you onboard at <strong>{company}</strong>.
              We hope you enjoy your journey with us. If you have any questions
              or need assistance, feel free to reach out.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button className="py-2.5 px-5 bg-white rounded-md text-black text-sm font-semibold no-underline text-center pointer-events-none select-none">
                Get Started
              </Button>
            </Section>
            <Text className="text-start text-sm text-white">
              Cheers,
              <br />
              The {company} Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

interface WelcomeEmailProps {
  username?: string;
  company?: string;
}

const baseUrl = process.env.URL ? `https://${process.env.URL}` : '';

export default WelcomeEmail;
