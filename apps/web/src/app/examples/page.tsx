import type { Metadata } from "next";
import Image from "next/image";
import { Anchor } from "../../components/anchor";
import { Example } from "../../components/example";
import { Footer } from "../../components/footer";
import { Heading } from "../../components/heading";
import { Text } from "../../components/text";
import { Topbar } from "../../components/topbar";
import PageTransition from "../../components/page-transition";

const items = [
  {
    path: "magic-links/aws-verify-email",
    name: "AWS / Verify Email",
    author: "thecodeinfluencer",
  },
  {
    path: "notifications/github-access-token",
    name: "GitHub / Access Token",
    author: "bruno88cabral",
  },
  {
    path: "receipts/apple-receipt",
    name: "Apple / Receipt",
    author: "relferreira",
  },
  {
    path: "receipts/nike-receipt",
    name: "Nike / Receipt",
    author: "camillegachido",
  },
  {
    path: "newsletters/stack-overflow-tips",
    name: "Stack Overflow / Tips",
    author: "bruno88cabral",
  },
  {
    path: "magic-links/slack-confirm",
    name: "Slack / Confirm Email",
    author: "c0dr",
  },
  {
    path: "reset-password/twitch-reset-password",
    name: "Twitch / Reset Password",
    author: "EmersonGarrido",
  },
  {
    path: "magic-links/raycast-magic-link",
    name: "Raycast / Magic Link",
    author: "abhinandanwadwa",
  },
  {
    path: "notifications/yelp-recent-login",
    name: "Yelp / Recent Login",
    author: "EmersonGarrido",
  },
  {
    path: "magic-links/linear-login-code",
    name: "Linear / Login Code",
    author: "Rychillie",
  },
  {
    path: "newsletters/google-play-policy-update",
    name: "Google Play / Policy Update",
    author: "EmersonGarrido",
  },
  {
    path: "reviews/airbnb-review",
    name: "Airbnb / Review",
    author: "joaom00",
  },
  {
    path: "reset-password/dropbox-reset-password",
    name: "Dropbox / Reset Password",
    author: "ribeiroevandro",
  },
  {
    path: "welcome/koala-welcome",
    name: "Koala / Welcome",
    author: "nettofarah",
  },
  {
    path: "notifications/vercel-invite-user",
    name: "Vercel / Invite User",
    author: "zenorocha",
  },
  {
    path: "welcome/stripe-welcome",
    name: "Stripe / Welcome",
    author: "zenorocha",
  },
  {
    path: "magic-links/notion-magic-link",
    name: "Notion / Magic Link",
    author: "bukinoshita",
  },
  {
    path: "magic-links/plaid-verify-identity",
    name: "Plaid / Verify Identity",
    author: "zenorocha",
  },
  {
    path: "magic-links/jobaccepted-magic-link",
    name: "Job Accepted / Magic Link with code",
    author: "vonsa",
  },
];

const title = "Examples — React Email";
const description = "Open source templates built with React Email";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

const Examples = () => {
  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-7xl flex-col justify-between px-4 h-screen-ios">
      <Image
        alt=""
        className="pointer-events-none absolute inset-0 z-[3] select-none mix-blend-lighten"
        fill
        priority
        src="/static/bg.png"
      />
      <Topbar />
      <PageTransition
        className="mx-auto flex max-w-3xl flex-col justify-center py-10"
        key="about"
        tag="main"
      >
        <div className="mb-12 max-w-[46rem] text-center">
          <Heading className="mb-2 text-white" size="8">
            Examples
          </Heading>
          <Text as="p" className="text-slate-11" size="4">
            {description}.
          </Text>
          <Text as="p" className="text-slate-11" size="4">
            Recreate an{" "}
            <Anchor
              href="https://github.com/resend/react-email/issues?q=is%3Aissue+is%3Aopen+label%3A%22app%3A+demo%22"
              target="_blank"
            >
              existing email
            </Anchor>{" "}
            or submit a{" "}
            <Anchor
              href="https://github.com/resend/react-email/tree/main/demo"
              target="_blank"
            >
              pull request
            </Anchor>{" "}
            to add your template here.
          </Text>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {items.map((item) => (
            <Example key={item.path} {...item} />
          ))}
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Examples;
