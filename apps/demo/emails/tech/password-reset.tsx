import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import { TechFonts } from './tech-fonts';
import { techTailwindConfig } from './theme';

interface TechPasswordResetEmailProps {
  companyName?: string;
  url?: string;
}

export const TechPasswordResetEmail = ({
  companyName = 'Halo',
  url = 'https://example.com/',
}: TechPasswordResetEmailProps) => (
  <Tailwind config={techTailwindConfig}>
    <Html>
      <Head>
        <TechFonts />
      </Head>
      <Preview>Reset your password</Preview>
      <Body className="bg-bg-2 m-0 p-0">
        <Container className="mx-auto w-full max-w-[640px]">
          <Section className="bg-bg-3 px-0 pt-14 text-center">
            <Section className="px-6 pb-[72px]">
              <Section className="mb-8">
                <Img
                  src="/static/tech/logo-wordmark.png"
                  alt="Logo"
                  width={64}
                  className="block mx-auto"
                />
              </Section>

              <Section className="mx-auto mb-8 max-w-[448px]">
                <Text className="m-0 font-40 font-geist text-fg">
                  Reset your password
                </Text>
                <Text className="m-0 mt-6 font-14 font-sans text-fg-2">
                  We got a request to reset your {companyName} store password.
                  <br />
                  If that wasn&apos;t you, ignore this—your ring orders stay
                  secure.
                </Text>
              </Section>

              <Button
                href={url}
                className="inline-block border border-button-border bg-white px-[20px] py-[12px] font-15 font-sans text-[#1F2222] rounded-[8px]"
              >
                Create New Password
              </Button>
            </Section>
          </Section>

          <Section className="px-6 py-20 text-center">
            <Section className="mx-auto max-w-[320px]">
              <Text className="m-0 font-13 font-sans text-fg-2">
                {companyName} is the AI ring on your finger—easy shopping, clear
                shipping, and real support when you need it.
              </Text>

              <Section className="mx-auto mt-8 mb-8 w-fit">
                <Row>
                  <Column className="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" className="inline-block">
                      <Img
                        src="/static/shared/social-x-black.png"
                        alt="X"
                        width={20}
                        height={20}
                        className="block"
                      />
                    </Link>
                  </Column>
                  <Column className="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" className="inline-block">
                      <Img
                        src="/static/shared/social-in-black.png"
                        alt="LinkedIn"
                        width={20}
                        height={20}
                        className="block"
                      />
                    </Link>
                  </Column>
                  <Column className="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" className="inline-block">
                      <Img
                        src="/static/shared/social-yt-black.png"
                        alt="YouTube"
                        width={20}
                        height={20}
                        className="block"
                      />
                    </Link>
                  </Column>
                  <Column className="w-[20px]">
                    <Link href="https://example.com/" className="inline-block">
                      <Img
                        src="/static/shared/social-gh-black.png"
                        alt="GitHub"
                        width={20}
                        height={20}
                        className="block"
                      />
                    </Link>
                  </Column>
                </Row>
              </Section>

              <Text className="m-0 font-11 font-sans text-fg-2">
                123 Market Street, Floor 1
                <br />
                Tech City, CA, 94102
              </Text>
              <Text className="m-0 mt-5 font-11 font-sans text-fg-2">
                <Link href="https://example.com/" className="text-fg-2">
                  Unsubscribe
                </Link>{' '}
                from {companyName} marketing emails.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default TechPasswordResetEmail;
