import type { Metadata } from 'next';
import Image from 'next/image';
import { Anchor } from '../../components/anchor';
import { Heading } from '../../components/heading';
import PageTransition from '../../components/page-transition';
import { Template } from '../../components/template';
import { Text } from '../../components/text';

const items = [
  {
    path: 'magic-links/aws-verify-email',
    name: 'AWS / Verify Email',
    author: 'thecodeinfluencer',
  },
  {
    path: 'notifications/github-access-token',
    name: 'GitHub / Access Token',
    author: 'bruno88cabral',
  },
  {
    path: 'receipts/apple-receipt',
    name: 'Apple / Receipt',
    author: 'relferreira',
  },
  {
    path: 'receipts/nike-receipt',
    name: 'Nike / Receipt',
    author: 'camillegachido',
  },
  {
    path: 'newsletters/stack-overflow-tips',
    name: 'Stack Overflow / Tips',
    author: 'bruno88cabral',
  },
  {
    path: 'magic-links/slack-confirm',
    name: 'Slack / Confirm Email',
    author: 'c0dr',
  },
  {
    path: 'reset-password/twitch-reset-password',
    name: 'Twitch / Reset Password',
    author: 'EmersonGarrido',
  },
  {
    path: 'magic-links/raycast-magic-link',
    name: 'Raycast / Magic Link',
    author: 'abhinandanwadwa',
  },
  {
    path: 'notifications/yelp-recent-login',
    name: 'Yelp / Recent Login',
    author: 'EmersonGarrido',
  },
  {
    path: 'magic-links/linear-login-code',
    name: 'Linear / Login Code',
    author: 'Rychillie',
  },
  {
    path: 'newsletters/google-play-policy-update',
    name: 'Google Play / Policy Update',
    author: 'EmersonGarrido',
  },
  {
    path: 'reviews/airbnb-review',
    name: 'Airbnb / Review',
    author: 'joaom00',
  },
  {
    path: 'reset-password/dropbox-reset-password',
    name: 'Dropbox / Reset Password',
    author: 'ribeiroevandro',
  },
  {
    path: 'welcome/koala-welcome',
    name: 'Koala / Welcome',
    author: 'nettofarah',
  },
  {
    path: 'notifications/vercel-invite-user',
    name: 'Vercel / Invite User',
    author: 'zenorocha',
  },
  {
    path: 'welcome/stripe-welcome',
    name: 'Stripe / Welcome',
    author: 'zenorocha',
  },
  {
    path: 'magic-links/notion-magic-link',
    name: 'Notion / Magic Link',
    author: 'bukinoshita',
  },
  {
    path: 'magic-links/plaid-verify-identity',
    name: 'Plaid / Verify Identity',
    author: 'zenorocha',
  },
];

const title = 'Templates — React Email';
const description = 'Open source templates built with React Email';
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

const Templates = () => (
  <>
    <Image
      alt=""
      className="pointer-events-none absolute inset-0 z-[3] select-none mix-blend-lighten"
      fill
      priority
      src="/static/bg.png"
    />
    <PageTransition
      className="mx-auto flex max-w-3xl flex-col justify-center px-1 py-10 md:px-0"
      key="about"
      tag="main"
    >
      <div className="mb-12 text-pretty px-6 md:max-w-[46rem] md:px-0 md:text-center">
        <Heading className="text-white" size="6">
          Templates
        </Heading>
        <Text as="p" className="mt-4 text-slate-11" size="2">
          {description}.
        </Text>
        <Text as="p" className="mt-2 text-slate-11" size="2">
          Recreate an{' '}
          <Anchor
            href="https://github.com/resend/react-email/issues?q=is%3Aissue+is%3Aopen+label%3A%22app%3A+demo%22"
            target="_blank"
          >
            existing email
          </Anchor>{' '}
          or submit a{' '}
          <Anchor
            href="https://github.com/resend/react-email/tree/main/demo"
            target="_blank"
          >
            pull request
          </Anchor>{' '}
          to add your template here.
        </Text>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {items.map((item) => (
          <Template key={item.path} {...item} />
        ))}
      </div>
    </PageTransition>
  </>
);

export default Templates;
