import { Anchor } from '../../components/anchor';
import { Example } from '../../components/example';
import { Footer } from '../../components/footer';
import { Heading } from '../../components/heading';
import { Text } from '../../components/text';
import { Topbar } from '../../components/topbar';
import Head from 'next/head';
import Image from 'next/image';

const items = [
  {
    id: 'github-access-token',
    name: 'GitHub / Access Token',
    author: 'bruno88cabral',
  },
  {
    id: 'apple-receipt',
    name: 'Apple / Receipt',
    author: 'relferreira',
  },
  {
    id: 'nike-receipt',
    name: 'Nike / Receipt',
    author: 'camillegachido',
  },
  {
    id: 'stack-overflow-tips',
    name: 'Stack Overflow / Tips',
    author: 'bruno88cabral',
  },
  {
    id: 'slack-confirm',
    name: 'Slack / Confirm Email',
    author: 'c0dr',
  },
  {
    id: 'twitch-reset-password',
    name: 'Twitch / Reset Password',
    author: 'EmersonGarrido',
  },
  {
    id: 'raycast-magic-link',
    name: 'Raycast / Magic Link',
    author: 'abhinandanwadwa',
  },
  {
    id: 'yelp-recent-login',
    name: 'Yelp / Recent Login',
    author: 'EmersonGarrido',
  },
  {
    id: 'linear-login-code',
    name: 'Linear / Login Code',
    author: 'Rychillie',
  },
  {
    id: 'google-play-policy-update',
    name: 'Google Play / Policy Update',
    author: 'EmersonGarrido',
  },
  {
    id: 'airbnb-review',
    name: 'Airbnb / Review',
    author: 'joaom00',
  },
  {
    id: 'dropbox-reset-password',
    name: 'Dropbox / Reset Password',
    author: 'ribeiroevandro',
  },
  {
    id: 'koala-welcome',
    name: 'Koala / Welcome',
    author: 'nettofarah',
  },
  {
    id: 'vercel-invite-user',
    name: 'Vercel / Invite User',
    author: 'zenorocha',
  },
  {
    id: 'stripe-welcome',
    name: 'Stripe / Welcome',
    author: 'zenorocha',
  },
  {
    id: 'notion-magic-link',
    name: 'Notion / Magic Link',
    author: 'bukinoshita',
  },
  {
    id: 'plaid-verify-identity',
    name: 'Plaid / Verify Identity',
    author: 'zenorocha',
  },
];

export default function Examples() {
  const title = 'Examples — React Email';
  const description = 'Open source templates built with React Email';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div className="h-screen-ios relative z-20 mx-auto flex max-w-7xl flex-col px-4">
        <Topbar />
        <div className="relative mx-auto flex max-w-3xl flex-col justify-center py-10">
          <div className="mb-12 max-w-[745px] text-center">
            <Heading size="8" className="mb-2 text-white">
              Examples
            </Heading>
            <Text as="p" size="4" className="text-slate-11">
              {description}.
            </Text>
            <Text as="p" size="4" className="text-slate-11">
              Recreate an{' '}
              <Anchor
                target="_blank"
                href="https://github.com/zenorocha/react-email/issues?q=is%3Aissue+is%3Aopen+label%3A%22app%3A+demo%22"
                appearance="white"
              >
                existing email
              </Anchor>{' '}
              or submit a{' '}
              <Anchor
                target="_blank"
                href="https://github.com/zenorocha/react-email/tree/main/apps/demo/emails"
                appearance="white"
              >
                pull request
              </Anchor>{' '}
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
        className="absolute top-[220px] left-0 z-[10] h-full w-full select-none md:top-0"
        fill
        priority
        src="/static/bg.png"
        alt={''}
        style={{ position: 'absolute' }}
      />
    </>
  );
}
