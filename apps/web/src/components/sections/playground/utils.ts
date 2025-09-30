export const tailwindCSSCode = `import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components';

const WelcomeEmail = ({
  username = 'Steve',
  company = 'Resend',
}: WelcomeEmailProps) => {
  const previewText = \`Welcome to \${company}, \${username}!\`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white m-auto font-sans">
          <Container className="mb-10 mx-auto p-5 w-[465px]">
            <Section className="mt-10">
              <Img
                src={\`\${baseUrl}/brand/vercel.png\`}
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
              <Button
                className="py-2.5 px-5 bg-white rounded-md text-black text-sm font-semibold no-underline text-center"
                href={\`\${baseUrl}/get-started\`}
              >
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

const baseUrl = process.env.URL ? \`https://\${process.env.URL}\` : '';

export default WelcomeEmail;`;

export const cssCode = `import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components';

const WelcomeEmail = ({
  username = 'Steve',
  company = 'Resend',
}: WelcomeEmailProps) => {
  const previewText = \`Welcome to \${company}, \${username}!\`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: 'white', margin: 'auto', fontFamily: 'var(--font-sans)' }}>
          <Container style={{ marginBottom: '40px', marginLeft: 'auto', marginRight: 'auto', padding: '20px', width: '465px' }}>
            <Section style={{ marginTop: '40px' }}>
              <Img
                src={\`\${baseUrl}/brand/vercel.png\`}
                width="60"
                height="60"
                alt="Logo Example"
                style={{ margin: '0', marginLeft: 'auto', marginRight: 'auto' }}
              />
            </Section>
            <Heading style={{ fontSize: '24px', color: 'white', fontWeight: 'normal', textAlign: 'center', margin: '0', marginTop: '32px', marginLeft: '0', marginRight: '0' }}>
              Welcome to <strong>{company}</strong>, {username}!
            </Heading>
            <Text style={{ textAlign: 'start', fontSize: '14px', color: 'white' }}>
              Hello {username},
            </Text>
            <Text style={{ textAlign: 'start', fontSize: '14px', color: 'white', lineHeight: '1.625' }}>
              We're excited to have you onboard at <strong>{company}</strong>.
              We hope you enjoy your journey with us. If you have any questions
              or need assistance, feel free to reach out.
            </Text>
            <Section style={{ textAlign: 'center', marginTop: '32px', marginBottom: '32px' }}>
              <Button
                style={{ padding: '10px 20px', backgroundColor: 'white', borderRadius: '6px', color: 'black', fontSize: '14px', fontWeight: 'semibold', textDecoration: 'none', textAlign: 'center' }}
                href={\`\${baseUrl}/get-started\`}
              >
                Get Started
              </Button>
            </Section>
            <Text style={{ textAlign: 'start', fontSize: '14px', color: 'white' }}>
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

const baseUrl = process.env.URL ? \`https://\${process.env.URL}\` : '';

export default WelcomeEmail;`;
