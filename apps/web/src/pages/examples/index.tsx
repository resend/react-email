import Head from "next/head";
import Image from "next/image";
import { Anchor } from "../../components/anchor";
import { Example, type ExampleProps } from "../../components/example";
import { Footer } from "../../components/footer";
import { Heading } from "../../components/heading";
import { Text } from "../../components/text";
import { Topbar } from "../../components/topbar";

const items = [
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
] satisfies ExampleProps[];

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
              <Example key={item.path} {...item} />
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
