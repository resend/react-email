import Head from "next/head";
import Image from "next/image";
import { Anchor } from "../../components/anchor";
import { Example } from "../../components/example";
import { Footer } from "../../components/footer";
import { Heading } from "../../components/heading";
import { Text } from "../../components/text";
import { Topbar } from "../../components/topbar";

const items = [
  {
    id: "github-access-token.tsx",
    name: "GitHub / Access Token",
    author: "bruno88cabral",
  },
  {
    id: "apple-receipt.tsx",
    name: "Apple / Receipt",
    author: "relferreira",
  },
  {
    id: "nike-receipt.tsx",
    name: "Nike / Receipt",
    author: "camillegachido",
  },
  {
    id: "stack-overflow-tips.tsx",
    name: "Stack Overflow / Tips",
    author: "bruno88cabral",
  },
  {
    id: "slack-confirm.tsx",
    name: "Slack / Confirm Email",
    author: "c0dr",
  },
  {
    id: "twitch-reset-password.tsx",
    name: "Twitch / Reset Password",
    author: "EmersonGarrido",
  },
  {
    id: "raycast-magic-link.tsx",
    name: "Raycast / Magic Link",
    author: "abhinandanwadwa",
  },
  {
    id: "yelp-recent-login.tsx",
    name: "Yelp / Recent Login",
    author: "EmersonGarrido",
  },
  {
    id: "linear-login-code.tsx",
    name: "Linear / Login Code",
    author: "Rychillie",
  },
  {
    id: "google-play-policy-update.tsx",
    name: "Google Play / Policy Update",
    author: "EmersonGarrido",
  },
  {
    id: "airbnb-review.tsx",
    name: "Airbnb / Review",
    author: "joaom00",
  },
  {
    id: "dropbox-reset-password.tsx",
    name: "Dropbox / Reset Password",
    author: "ribeiroevandro",
  },
  {
    id: "koala-welcome.tsx",
    name: "Koala / Welcome",
    author: "nettofarah",
  },
  {
    id: "vercel-invite-user.tsx",
    name: "Vercel / Invite User",
    author: "zenorocha",
  },
  {
    id: "stripe-welcome.tsx",
    name: "Stripe / Welcome",
    author: "zenorocha",
  },
  {
    id: "notion-magic-link.tsx",
    name: "Notion / Magic Link",
    author: "bukinoshita",
  },
  {
    id: "plaid-verify-identity.tsx",
    name: "Plaid / Verify Identity",
    author: "zenorocha",
  },
];

const title = "Examples — React Email";
const description = "Open source templates built with React Email";

const Examples = () => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={title} property="og:title" />
        <meta content={description} property="og:description" />
      </Head>

      <div className="h-screen-ios relative z-20 mx-auto flex max-w-7xl flex-col px-4">
        <Topbar />

        <div className="relative mx-auto flex max-w-3xl flex-col justify-center py-10">
          <div className="mb-12 max-w-[745px] text-center">
            <Heading className="mb-2 text-white" size="8">
              Examples
            </Heading>

            <Text as="p" className="text-slate-11" size="4">
              {description}.
            </Text>

            <Text as="p" className="text-slate-11" size="4">
              Recreate an{" "}
              <Anchor
                appearance="white"
                href="https://github.com/resend/react-email/issues?q=is%3Aissue+is%3Aopen+label%3A%22app%3A+demo%22"
                target="_blank"
              >
                existing email
              </Anchor>{" "}
              or submit a{" "}
              <Anchor
                appearance="white"
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
              <Example key={item.id} {...item} />
            ))}
          </div>
        </div>

        <Footer />
      </div>

      <Image
        alt=""
        className="absolute top-[220px] left-0 z-[10] h-full w-full select-none md:top-0"
        fill
        priority
        src="/static/bg.png"
      />
    </>
  );
};

export default Examples;
