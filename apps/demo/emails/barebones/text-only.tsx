import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import { barebonesBoxedTailwindConfig } from './theme';
import { BarebonesFonts } from './theme-fonts';

const textOnlyTitle = 'A quick note from Barebones';

const textOnlyParagraphs = [
  'This is the text-only layout: no hero image and no primary call-to-action. Use it for concise product notes, receipts, account updates, and other plain-language emails where the message should stay front and center.',
  'Keep paragraphs short and focused so the content is easy to scan on mobile. If you need richer visuals or a conversion button, switch to another collage template.',
  'Replace this placeholder copy by editing this template file directly.',
];

interface TextOnlyEmailProps {
  companyName: string;
  url: string;
}

export const TextOnlyEmail = ({ companyName, url }: TextOnlyEmailProps) => (
  <Tailwind config={barebonesBoxedTailwindConfig}>
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>
      <Preview>A note from {companyName}</Preview>
      <Body className="bg-bg-2 m-0 text-center font-sans">
        <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
          <Section>
            <Section className="bg-bg mobile:px-2 px-6 py-4">
              <Section className="mb-3 px-6">
                <Row>
                  <Column className="w-1/2 py-[7px] align-middle">
                    <Row>
                      <Column className="w-[32px] align-middle">
                        <Img
                          src="/static/shared/logo-black.png"
                          alt=""
                          width={23}
                          className="block"
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column align="right" className="w-1/2 py-[7px] align-middle">
                    <Text className="font-13 m-0 text-right font-sans">
                      <span className="text-fg-3">{companyName}</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-20 text-left">
                <Section className="mb-8">
                  <Heading
                    as="h1"
                    className="font-28 text-fg m-0 text-left font-sans"
                  >
                    {textOnlyTitle}
                  </Heading>
                </Section>

                {textOnlyParagraphs.map((block, i) => (
                  <Text
                    key={i}
                    className="font-16 text-fg-2 mt-0 mb-6 max-w-[420px] text-left font-sans last:mb-0"
                  >
                    {block}
                  </Text>
                ))}

                <Text className="font-16 text-fg-2 mt-0 mb-6 max-w-[420px] text-left font-sans">
                  <Link href={url} className="text-fg">
                    Open your account
                  </Link>
                </Text>

                <Text className="font-13 text-fg-3 mt-8 mb-0 text-left font-sans">
                  Thanks,
                  <br />
                  The Barebones Team
                </Text>
              </Section>

              {/* Footer */}
              <Section className="bg-bg">
                <Row>
                  <Column className="px-6 py-10 text-center">
                    <Text className="font-13 text-fg-3 mx-auto mt-0 mb-8 max-w-[280px] text-center font-sans">
                      Barebones is the catchy slogan that perfectly encapsulates
                      the vision of our company.
                    </Text>

                    <Section className="mb-8">
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src="/static/shared/social-x-black.png"
                          alt="X"
                          width={18}
                          className="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src="/static/shared/social-in-black.png"
                          alt="LinkedIn"
                          width={18}
                          className="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src="/static/shared/social-yt-black.png"
                          alt="YouTube"
                          width={18}
                          className="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src="/static/shared/social-gh-black.png"
                          alt="GitHub"
                          width={18}
                          className="block"
                        />
                      </Link>
                    </Section>

                    <Text className="font-11 text-fg-3 mt-4 mb-5 text-center font-sans">
                      123 Market Street, Floor 1
                      <br />
                      Tech City, CA, 94102
                    </Text>
                    <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                      <Link href="https://example.com/" className="text-fg-3">
                        Unsubscribe
                      </Link>{' '}
                      from {companyName} marketing emails.
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

TextOnlyEmail.PreviewProps = {
  companyName: 'Barebones',
  url: 'https://example.com/',
} satisfies TextOnlyEmailProps;

export default TextOnlyEmail;
