import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Markdown,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type * as React from 'react';

type HiringManagerIntroProps = {
  roleTitle?: string;
  companyName?: string;
  applicantName?: string;
  contactEmail?: string;
  highlights?: string[];
  portfolioUrl?: string;
};

export default function HiringManagerIntro({
  roleTitle = 'Open Source Engineer',
  companyName = 'Resend',
  applicantName = 'Adam Bowker',
  contactEmail = 'adambowker98@gmail.com',
  highlights = [
    'Shipped an AI testing platform at Amazon to replace flaky acceptance tests',
    'Turned the pain of cooking from looping TikToks into [Forkfile](https://www.getforkfile.com), then expanded into [CreatorCookbooks](https://www.creatorcookbooks.com) to help creators monetize recipes',
    'Built an obituary scraping platform @ [Tukios](https://www.tukios.com) to streamline funeral home website onboarding & growth-hack with demo sites',
    'Worked with a [PR company](https://www.heller-pr.com) to design tech solutions ranging from a VR voting campaign to a practice management platform for an ADHD clinic',
    'Taught hundreds of kids to code, then [sold the company](https://www.betabox.com/news/betabox-acquires-imagicode-to-expand-computer-science-offerings) during COVID (bittersweet)',
    '**Bonus**: Produced a middle-school [infomercial about lysosomes](https://www.youtube.com/watch?v=PS3Ao6j3Wuo) that somehow still lives in family lore',
  ],
  portfolioUrl = 'https://adbo.io',
}: HiringManagerIntroProps) {
  const preview = `Five quick reasons (and a bonus) why I'm a fit for the ${roleTitle} role at ${companyName}`;
  return (
    <Html>
      <Head>
        <style>{`
            a {
              color: #8bb4ff !important;
              text-decoration: underline !important;
            }
          `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Heading as="h2" style={styles.h1}>
              Hey {companyName} team 👋 — I just applied for {roleTitle}.
            </Heading>
            <Text style={styles.p}>
              Alongside my application, I thought it'd be fun to say hi here.
            </Text>

            <Section style={styles.highlightBox}>
              <Text style={styles.subhead}>
                Why me (5 quick reasons + a bonus):
              </Text>
              <Markdown
                markdownCustomStyles={{
                  ul: styles.list,
                  li: styles.li,
                }}
              >
                {highlights?.map((highlight) => `- ${highlight}`).join('\n')}
              </Markdown>
            </Section>

            {portfolioUrl && (
              <Text style={styles.p}>
                Curious for more? You can also browse my portfolio{' '}
                <a href={portfolioUrl} target="_blank" style={styles.link}>
                  here
                </a>
                .
              </Text>
            )}

            <Text style={styles.p}>
              If you're open to a quick chat, I'd love to buy you a (virtual)
              coffee.
            </Text>

            <Section style={styles.cta}>
              {contactEmail ? (
                <>
                  <Button
                    href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                      `Quick chat about ${roleTitle} @ ${companyName}`,
                    )}`}
                    style={styles.button}
                  >
                    <span style={{ color: '#0b0d11' }}>
                      Reply with one click
                    </span>
                  </Button>
                </>
              ) : (
                <Text style={styles.p}>Feel free to reply to this email.</Text>
              )}
            </Section>

            <Hr style={styles.hr} />

            <Text style={styles.signature}>
              Cheers,
              <br />
              {applicantName} (your hopeful future teammate)
            </Text>

            <Text style={styles.ps}>
              P.S. Built this template just to apply—felt like the most{' '}
              <strong>{companyName}</strong> way to say hi. 🙂
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: '#0b0d11',
    color: '#e6e8ec',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
    padding: '24px 0',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 16px',
  },
  card: {
    backgroundColor: '#11151a',
    border: '1px solid #20262d',
    borderRadius: 12,
    padding: 24,
  },
  h1: {
    margin: 0,
    fontSize: 20,
    lineHeight: '28px',
    fontWeight: 700,
    letterSpacing: '-0.2px',
  },
  subhead: {
    margin: '0 0 8px 0',
    fontWeight: 700,
  },
  p: {
    margin: '12px 0',
    lineHeight: '24px',
    fontSize: 14,
    color: '#c9d1d9',
  },
  list: {
    margin: 0,
    paddingLeft: 18,
  },
  li: {
    margin: '4px 0',
    lineHeight: '22px',
    fontSize: 14,
  },
  highlightBox: {
    backgroundColor: '#0f1318',
    border: '1px solid #1f2630',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  cta: {
    marginTop: 12,
  },
  button: {
    backgroundColor: '#8bb4ff',
    color: '#0b0d11',
    borderRadius: 8,
    padding: '12px 16px',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-block',
  },
  link: {
    color: '#8bb4ff',
    textDecoration: 'underline',
  },
  hr: {
    borderColor: '#20262d',
    margin: '16px 0',
  },
  signature: {
    marginTop: 12,
    fontSize: 14,
  },
  ps: {
    marginTop: 12,
    fontSize: 13,
    color: '#9aa4af',
    fontStyle: 'italic',
    lineHeight: '20px',
  },
};
