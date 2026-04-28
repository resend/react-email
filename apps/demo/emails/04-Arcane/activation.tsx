// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import {
  Body,
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
import { SkinFonts } from './skin-fonts';
import { skinTailwindConfig } from './theme';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

interface ActivationEmailProps {
  companyName: string;
  url: string;
}
export const ActivationEmail = ({ companyName, url }: ActivationEmailProps) => (
  <Tailwind config={skinTailwindConfig}>
    <Html>
      <Head>
        <SkinFonts />
      </Head>

      <Body className="bg-white m-0 p-0 font-15 font-sans">
        <Preview>Confirm your email address</Preview>
        <Section className="bg-white m-0 p-0 pt-[92px] mobile:pt-0">
          <Container className="bg-bg mx-auto w-full max-w-[640px]">
            <Section className="bg-bg pt-[40px] pr-[32px] pb-[24px] pl-[40px]">
              <Img
                src={`${baseUrl}/static/shared/logo-white.png`}
                alt=""
                width="32"
                height="32"
                className="block"
              />
            </Section>
            <Section className="px-[16px]">
              <Img
                src={`${baseUrl}/static/skin/skin-image-1.png`}
                alt=""
                width={608}
                className="block w-full max-w-[608px]"
              />
            </Section>
            <Section className="px-[40px] mobile:px-6 py-[80px]">
              <Section className="mb-[36px]">
                <Text className="mb-8 font-72 font-serif text-fg">
                  Almost there
                </Text>
                <Text className="m-0 mt-[18px] font-15 font-sans text-fg-2">
                  Thank you for signing up for {companyName}.
                </Text>
                <Text className="m-0 font-15 font-sans text-fg-2">
                  To verify your account, we just need to confirm your email.
                </Text>
              </Section>
              <Section className="text-left">
                <Link href={url} className="font-16 font-sans text-fg">
                  {'Confirm email \u2192'}
                </Link>
              </Section>
            </Section>
            <Section className="px-[40px] mobile:px-6 py-4">
              <Text className="m-0 max-w-[310px] font-11 font-sans text-fg-3">
                If you didn&apos;t create an account with {companyName}, you can
                ignore this email—your inbox won&apos;t be added to our list.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-12 px-[40px] mobile:px-6 pt-[80px] pb-[64px] border-stroke border-t">
              <Text className="m-0 max-w-[320px] font-13 font-sans text-fg-3">
                {companyName} crafts thoughtful skincare—barrier-first formulas,
                honest labels, and routines you&apos;ll actually keep.
              </Text>
              <Row align="left">
                <Column className="w-full align-top">
                  <Section align="left" className="mt-8 w-[152px]">
                    <Row align="left">
                      <Column className="pr-6 w-[20px]">
                        <Link
                          href="https://example.com/"
                          className="inline-block"
                        >
                          <Img
                            src={`${baseUrl}/static/skin/social-x.png`}
                            alt="X"
                            width="20"
                            height="20"
                            className="block"
                          />
                        </Link>
                      </Column>
                      <Column className="pr-6 w-[20px]">
                        <Link
                          href="https://example.com/"
                          className="inline-block"
                        >
                          <Img
                            src={`${baseUrl}/static/skin/social-li.png`}
                            alt="LinkedIn"
                            width="20"
                            height="20"
                            className="block"
                          />
                        </Link>
                      </Column>
                      <Column className="pr-6 w-[20px]">
                        <Link
                          href="https://example.com/"
                          className="inline-block"
                        >
                          <Img
                            src={`${baseUrl}/static/skin/social-yt.png`}
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
                            src={`${baseUrl}/static/skin/social-gh.png`}
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
                <Column className="pt-8 w-full align-top">
                  <Text className="m-0 font-11 font-sans text-fg-3">
                    124 Mercantile Row, Studio 3
                    <br />
                    Los Angeles, CA, 90013
                  </Text>
                </Column>
              </Row>
              <Row align="left">
                <Column className="pt-5 w-full align-top">
                  <Text className="m-0 max-w-[169px] font-11 font-sans text-fg-3">
                    <Link href="https://example.com/" className="text-fg-2">
                      Unsubscribe
                    </Link>{' '}
                    from {companyName} marketing emails.
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  </Tailwind>
);

ActivationEmail.PreviewProps = {
  companyName: 'Skin',
  url: 'https://example.com/',
} satisfies ActivationEmailProps;

export default ActivationEmail;
