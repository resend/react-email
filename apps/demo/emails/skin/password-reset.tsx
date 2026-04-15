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

interface PasswordResetEmailProps {
  companyName: string;
  url: string;
}
export const PasswordResetEmail = ({
  companyName,
  url,
}: PasswordResetEmailProps) => (
  <Tailwind config={skinTailwindConfig}>
    <Html>
      <Head>
        <SkinFonts />
      </Head>

      <Body className="m-0 bg-white p-0 font-15 font-sans">
        <Preview>Reset your password</Preview>
        <Section className="m-0 bg-white p-0 pt-[92px] mobile:pt-0">
          <Container className="bg-bg mx-auto w-full max-w-[640px]">
            <Section className="bg-bg mobile:px-6 px-[40px] pt-[40px] pb-[24px]">
              <Img
                src="/static/shared/logo-white.png"
                alt=""
                width="32"
                height="32"
                className="block"
              />
            </Section>

            <Section className="mobile:px-6 px-[40px] pt-[80px] pb-[56px]">
              <Section className="mb-[48px]">
                <Text className="font-72 text-fg mb-8 max-w-[480px] font-serif">
                  Reset your Password
                </Text>
                <Text className="font-15 text-fg-2 m-0 mt-[18px] max-w-[480px] font-sans">
                  We received a request to reset your password for {companyName}
                  .
                </Text>
                <Text className="font-15 text-fg-2 m-0 mt-[18px] max-w-[480px] font-sans">
                  Use the link below to choose a new password. If you
                  didn&apos;t request this, you can ignore this email.
                </Text>
              </Section>
              <Section className="text-left">
                <Link href={url} className="font-16 text-fg font-sans">
                  {'Reset password \u2192'}
                </Link>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mobile:px-6 border-stroke mt-12 border-t px-[40px] pt-[80px] pb-[64px]">
              <Text className="font-13 text-fg-3 m-0 max-w-[320px] font-sans">
                {companyName} crafts thoughtful skincare—barrier-first formulas,
                honest labels, and routines you&apos;ll actually keep.
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
                            src="/static/skin/social-x.png"
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
                            src="/static/skin/social-li.png"
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
                            src="/static/skin/social-yt.png"
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
                            src="/static/skin/social-gh.png"
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
                  <Text className="font-11 text-fg-3 m-0 font-sans">
                    124 Mercantile Row, Studio 3
                    <br />
                    Los Angeles, CA, 90013
                  </Text>
                </Column>
              </Row>
              <Row align="left">
                <Column className="w-full pt-5 align-top">
                  <Text className="font-11 text-fg-3 m-0 max-w-[169px] font-sans">
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

PasswordResetEmail.PreviewProps = {
  companyName: 'Skin',
  url: 'https://example.com/',
} satisfies PasswordResetEmailProps;

export default PasswordResetEmail;
