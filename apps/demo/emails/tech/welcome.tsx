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
} from "@react-email/components";
import { TechFonts } from "./tech-fonts";
import { techTailwindConfig } from "./theme";

type TechWelcomeFeature = {
  title: string;
  body: string;
};

interface TechWelcomeEmailProps {
  companyName?: string;
  url?: string;
}

const techWelcomeFeatures: TechWelcomeFeature[] = [
  {
    title: "Always present",
    body: "The ring stays on your finger—AI help at a glance, silent when you need focus.",
  },
  {
    title: "Learns your rhythm",
    body: "From workouts to wind-down, Halo learns your habits and keeps nudges relevant.",
  },
  {
    title: "Private by design",
    body: "Your wellness signals stay protected—on-device smarts with minimal cloud by default.",
  },
  {
    title: "Simple interactions",
    body: "Double-tap the ring, trace the edge, or speak softly—Halo answers without a screen.",
  },
];

/** Figma Email-Templates `2692:1907` — Tech welcome (hero, feature rows, join panel). */
export const TechWelcomeEmail = ({
  companyName = "Halo",
  url = "https://example.com/",
}: TechWelcomeEmailProps) => {
  return (
    <Tailwind config={techTailwindConfig}>
      <Html>
        <Head>
          <TechFonts />
        </Head>
        <Preview>Welcome to {companyName}</Preview>
        <Body className="bg-bg-3 m-0 p-0">
          <Container className="mx-auto max-w-[640px]">
            <Section className="bg-fg px-2 py-4 text-center">
              <Text className="m-0 font-14 font-sans text-bg">
                Welcome to {companyName}—set up your ring in minutes
              </Text>
            </Section>

            <Section className="bg-[#E8E8E8]">
              <Section className="px-0 pt-10 pb-12 text-center">
                <Img
                  src="/static/tech/logo-wordmark.png"
                  alt={`${companyName} logo`}
                  width={64}
                  className="block mx-auto"
                />

                <Text className="m-0 mx-auto mt-8 max-w-[440px] font-48 font-geist text-fg">
                  Meet the ring that thinks with you
                </Text>
              </Section>

              <Section className="mt-8">
                <Img
                  src="/static/tech/tech-image-5.png"
                  alt="Halo ring"
                  width={608}
                  className="block w-full"
                />
              </Section>

              <Section className="bg-white pt-10 text-center">
                <Button
                  href={url}
                  className="inline-block border border-button-border bg-white px-5 py-3 font-15 font-sans text-fg rounded-[8px]"
                >
                  Discover Halo
                </Button>
                <Text className="m-0 mt-4 font-11 font-sans text-fg-2">
                  Hands-free help from day one
                </Text>

                <Img
                  src="/static/tech/tech-image-6.png"
                  alt="Halo ring"
                  width={608}
                  className="block w-full"
                />
              </Section>

            </Section>

            <Section className="px-8 pt-8 pb-24">
              <Section className="mx-auto max-w-[468px] text-center">
                <Text className="m-0 font-32 font-geist text-fg">
                  Your personal AI companion, wrapped around your finger.
                </Text>
                <Text className="m-0 mt-6 font-14 font-sans text-fg-2">
                  More than jewelry—it&apos;s a quiet AI partner on your hand
                  that reads your rhythm, anticipates needs, and smooths your
                  day without another screen to manage.
                </Text>
                <Text className="m-0 mt-5 font-14 font-sans text-fg-2">
                  Voice-free smarts live in the ring: subtle taps, gentle
                  haptics, and answers when you ask—no feeds, no glare, no
                  friction at checkout or on the go.
                </Text>
                <Text className="m-0 mt-5 font-14 font-sans text-fg-2">
                  Subtle cues, smarter suggestions, all-day comfort on your
                  finger.
                </Text>
                <Button
                  href={url}
                  className="mt-[32px] inline-block border border-button-border bg-white px-[20px] py-[12px] font-15 font-sans text-[#1F2222] rounded-[8px]"
                >
                  Explore
                </Button>
              </Section>
            </Section>

            <Section className="px-6 py-20 text-center">
              <Section className="mx-auto max-w-[320px]">
                <Text className="m-0 font-13 font-sans text-fg-2">
                  {companyName} is the AI ring on your finger—easy shopping,
                  clear shipping, and real support when you need it.
                </Text>

                <Section className="mx-auto mt-8 mb-8 w-fit">
                  <Row>
                    <Column className="pr-[32px] w-[20px]">
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
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
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
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
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
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
                      <Link
                        href="https://example.com/"
                        className="inline-block"
                      >
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
                  </Link>{" "}
                  from {companyName} marketing emails.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default TechWelcomeEmail;
