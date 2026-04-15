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
import { DitherFonts } from './dither-fonts';
import { ditherTailwindConfig } from './theme';

interface ActivationEmailProps {
  companyName: string;
  url: string;
}

export const ActivationEmail = ({ companyName, url }: ActivationEmailProps) => (
  <Tailwind config={ditherTailwindConfig}>
    <Html>
      <Head>
        <DitherFonts />
      </Head>

      <Body className="bg-bg-2 font-14 m-0 p-0 font-sans">
        <Preview>Confirm your email address</Preview>
        <Container className="bg-bg mx-auto max-w-[640px]">
          <Section className="mobile:px-4 px-6 py-6">
            <Img
              src="/static/shared/logo-white.png"
              alt=""
              width="32"
              height="32"
              className="block"
            />
          </Section>

          <Section className="mobile:px-4 px-6">
            <Img
              src="/static/dither/dither-image-1.png"
              alt=""
              width={592}
              className="block w-full max-w-[592px]"
            />
          </Section>
          <Section className="mobile:px-4 mobile:py-10 px-6 py-14">
            <Section className="mobile:mb-8 mb-12">
              <Text className="font-56 font-condensed mobile:font-40 text-fg m-0 uppercase">
                almost there
              </Text>
              <Text className="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                Thank you for signing up for {companyName}.
              </Text>
              <Text className="font-14 text-fg-2 m-0 font-sans">
                To verify your account, we just need to confirm your email.
              </Text>
              <Text className="font-13 text-fg-3 m-0 mt-[18px] font-sans">
                If you didn&apos;t create an account, you can safely ignore this
                email.
              </Text>
            </Section>
            <Button
              href={url}
              className="bg-fg font-15 text-bg inline-block px-5 py-3.5 text-center font-sans"
            >
              Confirm Email
            </Button>
          </Section>

          {/* Footer */}
          <Section className="mobile:px-4 mobile:py-12 border-stroke border-t px-6 py-16">
            <Text className="font-13 text-fg-2 m-0 max-w-[320px] font-sans">
              {companyName} helps teams cut through noise—clear priorities,
              fewer tabs, and less busywork from idea to shipped work.
            </Text>
            <Row align="left">
              <Column className="w-full align-top">
                <Section align="left" className="mt-8 w-[152px]">
                  <Row align="left">
                    <Column className="w-[20px] pr-6">
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
                        <Img
                          src="/static/shared/social-x-white.png"
                          alt="X"
                          width="20"
                          height="20"
                          className="block"
                        />
                      </Link>
                    </Column>
                    <Column className="w-[20px] pr-6">
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
                        <Img
                          src="/static/shared/social-li-white.png"
                          alt="LinkedIn"
                          width="20"
                          height="20"
                          className="block"
                        />
                      </Link>
                    </Column>
                    <Column className="w-[20px] pr-6">
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
                        <Img
                          src="/static/shared/social-yt-white.png"
                          alt="YouTube"
                          width="20"
                          height="20"
                          className="block"
                        />
                      </Link>
                    </Column>
                    <Column className="w-[20px]">
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
                        <Img
                          src="/static/shared/social-gh-white.png"
                          alt="GitHub"
                          width="20"
                          height="20"
                          className="block"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
            <Row align="left">
              <Column className="w-full pt-8 align-top">
                <Text className="font-11 text-fg-2 m-0 font-sans">
                  123 Market Street, Floor 1
                  <br />
                  Tech City, CA, 94102
                </Text>
              </Column>
            </Row>
            <Row align="left">
              <Column className="w-full pt-5 align-top">
                <Text className="font-11 text-fg-2 m-0 max-w-[160px] font-sans">
                  <Link href="https://example.com/" className="text-fg-2">
                    Unsubscribe
                  </Link>{' '}
                  from {companyName} marketing emails.
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

ActivationEmail.PreviewProps = {
  companyName: 'Dither',
  url: 'https://example.com/',
} satisfies ActivationEmailProps;

export default ActivationEmail;
