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

const letterMaxWidthClass = "max-w-[430px]";

type TechNewsletterTip = {
  title: string;
  body: string;
  ctaLabel: string;
  imageSrc: string;
};

type TechNewsletterSpotlight = {
  title: string;
  body: string;
  imageSrc: string;
  buttonLabel: string;
};

type TechNewsletterCommunity = {
  imageSrc: string;
  headline: string;
  body: string;
  ctaLabel: string;
};

interface TechNewsletterEmailProps {
  companyName?: string;
  url?: string;
}

const techNewsletterLetterParagraphs = [
  "We're glad you're here. This is our space for Halo ring drops, sizing tips, and the stories behind each batch—we share what we're building, what we're learning, and when limited finishes return.",
  "No inbox noise—just emails when restocks land, firmware improves, or there's something meaningful for members. Thanks for reading; we're happy you're along for the journey.",
];

const techNewsletterTips: TechNewsletterTip[] = [
  {
    title: "Pick the right ring size online",
    body: "Use our printable sizer or visit a partner store so your Halo sits snug—returns are easier when the first fit is close.",
    ctaLabel: "Read More \u2192",
    imageSrc: "/static/tech/tech-image-4.png",
  },
  {
    title: "Keep your AI assistant subtle",
    body: "Toggle haptics and voice replies in the app so meetings stay quiet while you still get the nudges that matter.",
    ctaLabel: "Read More \u2192",
    imageSrc: "/static/tech/tech-image-4.png",
  },
];

const techNewsletterSpotlight: TechNewsletterSpotlight = {
  title: "Your personal AI companion, wrapped around your finger.",
  body: "Halo learns how you shop, move, and focus—then surfaces gentle prompts, order updates, and wellness cues without another screen.",
  imageSrc: "/static/tech/tech-image-3.png",
  buttonLabel: "Read More \u2192",
};

const techNewsletterCommunity: TechNewsletterCommunity = {
  imageSrc: "/static/tech/tech-image-2.png",
  headline: "Intelligence that doesn't demand attention.",
  body: "Shop your finish and size—we'll confirm inventory and ship fast.",
  ctaLabel: "Shop Halo",
};

/** Tech newsletter — same content blocks as Skin `newsletter.tsx`, light card layout (Figma Email-Templates family). */
export const TechNewsletterEmail = ({
  companyName = "Halo",
  url = "https://example.com/",
}: TechNewsletterEmailProps) => {
  return (
    <Tailwind config={techTailwindConfig}>
      <Html>
        <Head>
          <TechFonts />
        </Head>
        <Preview>The latest from {companyName}</Preview>
        <Body className="bg-bg-3 m-0 p-0">
          <Container className="mx-auto max-w-[640px]">
            <Section className="rounded-[10px] bg-bg-2">
              <Section className="bg-bg-3">
                <Img
                  src={techNewsletterCommunity.imageSrc}
                  alt=""
                  width={608}
                  className="block w-full max-w-[608px] rounded-t-[10px]"
                />
              </Section>

              <Section className="px-6 pt-14">
                <Text
                  className={`font-geist font-40 text-fg m-0 mx-auto text-center ${letterMaxWidthClass}`}
                >
                  Why your finger is the calmest screen
                </Text>

                {techNewsletterLetterParagraphs.map((p, i) => (
                  <Text
                    key={i}
                    className={`font-14 text-fg-2 m-0 mx-auto mt-6 text-center font-sans ${letterMaxWidthClass}`}
                  >
                    {p}
                  </Text>
                ))}
              </Section>

              <Section className="mx-auto px-6 pt-14">
                <Section className="mx-auto max-w-[560px] rounded-[10px]">
                  <Img
                    src={techNewsletterSpotlight.imageSrc}
                    alt=""
                    width={560}
                    className="block w-full max-w-[560px] rounded-[10px]"
                  />
                </Section>

                <Section className="mt-10 mr-auto w-full max-w-[420px]">
                  <Text className="m-0 font-22 font-geist text-fg text-center">
                    {techNewsletterSpotlight.title}
                  </Text>
                  <Text className="m-0 mt-6 font-14 font-sans text-fg-2 text-center">
                    {techNewsletterSpotlight.body}
                  </Text>
                </Section>
              </Section>

              <Section className="px-6 pt-14">
                <Text className="m-0 font-22 font-geist text-fg text-center">
                  From the Halo journal
                </Text>
              </Section>

              <Section className="px-6 pt-8">
                <Section className="mx-auto max-w-[560px]">
                  <Row>
                    {techNewsletterTips.map((tip, idx) => (
                      <Column
                        key={idx}
                        className={
                          idx === 0
                            ? "w-1/2 pr-2 align-top"
                            : "w-1/2 pl-2 align-top"
                        }
                      >
                        <Section className="px-2 py-4 rounded-[10px]">
                          <Section className="rounded-[8px]">
                            <Img
                              src={tip.imageSrc}
                              alt=""
                              width={252}
                              className="block w-full max-w-[252px] rounded-[8px]"
                            />
                          </Section>
                          <Text className="m-0 mt-4 font-14 font-sans text-fg">
                            {tip.title}
                          </Text>
                          <Text className="m-0 mt-3 font-14 font-sans text-fg-2">
                            {tip.body}
                          </Text>
                          <Section className="mt-4">
                            <Link
                              href="https://example.com/"
                              className="font-14 font-sans text-fg-3"
                            >
                              {tip.ctaLabel}
                            </Link>
                          </Section>
                        </Section>
                      </Column>
                    ))}
                  </Row>
                </Section>
              </Section>

              <Section className="px-6 pt-12 pb-12">
                <Section className="bg-bg-2 mx-auto px-4 py-10 rounded-[10px] max-w-[560px] text-center">
                  <Text className="m-0 font-20 font-geist text-fg">
                    {techNewsletterCommunity.headline}
                  </Text>
                  <Text className="m-0 mt-3 font-14 font-sans text-fg-2">
                    {techNewsletterCommunity.body}
                  </Text>
                  <Section className="mt-6">
                    <Button
                      href={url}
                      className="inline-block border border-button-border bg-white px-5 py-3 font-15 font-sans text-fg rounded-[8px]"
                    >
                      {techNewsletterCommunity.ctaLabel}
                    </Button>
                  </Section>
                </Section>
              </Section>

              <Section className={`mx-auto px-6 pb-8 ${letterMaxWidthClass}`}>
                <Text className="m-0 font-14 font-sans text-fg-3 text-center">
                  {companyName} is the AI ring on your finger—easy shopping,
                  clear shipping, and real support when you need it.
                </Text>
              </Section>

              <Section className="px-6 pt-2 pb-16 text-center">
                <Section className="mx-auto max-w-[320px]">
                  <Section className="mx-auto mt-2 mb-8 w-fit">
                    <Row>
                      <Column className="pr-[20px] w-[20px]">
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
                      <Column className="pr-[20px] w-[20px]">
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
                      <Column className="pr-[20px] w-[20px]">
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

                  <Text className="m-0 font-11 font-sans text-fg-3">
                    123 Market Street, Floor 1
                    <br />
                    Tech City, CA, 94102
                  </Text>
                  <Text className="m-0 mt-5 font-11 font-sans text-fg-3">
                    <Link href="https://example.com/" className="text-fg-2">
                      Unsubscribe
                    </Link>{" "}
                    from {companyName} marketing emails.
                  </Text>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default TechNewsletterEmail;
