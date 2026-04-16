import { Heading } from './heading';
import { Template } from './template';

interface TemplateItem {
  name: string;
  author?: string;
  href: string;
  github?: string;
  figma?: string;
  image?: string;
}

const DEMO_EMAIL_PREVIEW_BASE_URL = 'https://demo.react.email/preview';
const GITHUB_BASE =
  'https://github.com/resend/react-email/tree/canary/apps/demo/emails';
const FIGMA_BASE = 'https://figma.com/community/file';

const officialItems: TemplateItem[] = [
  {
    name: 'Barebone',
    image: '/static/templates/barebone-cover.jpeg',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/01-Barebone/welcome`,
    github: `${GITHUB_BASE}/01-Barebone`,
    figma: `${FIGMA_BASE}/barebone`,
  },
  {
    name: 'Matte',
    image: '/static/templates/matte-cover.jpeg',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/02-Matte/welcome`,
    github: `${GITHUB_BASE}/02-Matte`,
    figma: `${FIGMA_BASE}/matte`,
  },
  {
    name: 'Protocol',
    image: '/static/templates/protocol-cover.jpeg',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/03-Protocol/welcome`,
    github: `${GITHUB_BASE}/03-Protocol`,
    figma: `${FIGMA_BASE}/protocol`,
  },
  {
    name: 'Arcane',
    image: '/static/templates/arcane-cover.jpeg',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/04-Arcane/welcome`,
    github: `${GITHUB_BASE}/04-Arcane`,
    figma: `${FIGMA_BASE}/arcane`,
  },
  {
    name: 'Studio',
    image: '/static/templates/studio-cover.jpeg',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/05-Studio/welcome`,
    github: `${GITHUB_BASE}/05-Studio`,
    figma: `${FIGMA_BASE}/studio`,
  },
];

const communityItems: TemplateItem[] = [
  {
    image: '/examples/aws-verify-email.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/magic-links/aws-verify-email`,
    name: 'AWS / Verify Email',
    author: 'thecodeinfluencer',
  },
  {
    image: '/examples/github-access-token.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/notifications/github-access-token`,
    name: 'GitHub / Access Token',
    author: 'bruno88cabral',
  },
  {
    image: '/examples/apple-receipt.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/receipts/apple-receipt`,
    name: 'Apple / Receipt',
    author: 'relferreira',
  },
  {
    image: '/examples/nike-receipt.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/receipts/nike-receipt`,
    name: 'Nike / Receipt',
    author: 'camillegachido',
  },
  {
    image: '/examples/stack-overflow-tips.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/newsletters/stack-overflow-tips`,
    name: 'Stack Overflow / Tips',
    author: 'bruno88cabral',
  },
  {
    image: '/examples/slack-confirm.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/magic-links/slack-confirm`,
    name: 'Slack / Confirm Email',
    author: 'c0dr',
  },
  {
    image: '/examples/twitch-reset-password.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/reset-password/twitch-reset-password`,
    name: 'Twitch / Reset Password',
    author: 'EmersonGarrido',
  },
  {
    image: '/examples/raycast-magic-link.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/magic-links/raycast-magic-link`,
    name: 'Raycast / Magic Link',
    author: 'abhinandanwadwa',
  },
  {
    image: '/examples/yelp-recent-login.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/notifications/yelp-recent-login`,
    name: 'Yelp / Recent Login',
    author: 'EmersonGarrido',
  },
  {
    image: '/examples/linear-login-code.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/magic-links/linear-login-code`,
    name: 'Linear / Login Code',
    author: 'Rychillie',
  },
  {
    image: '/examples/google-play-policy-update.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/newsletters/google-play-policy-update`,
    name: 'Google Play / Policy Update',
    author: 'EmersonGarrido',
  },
  {
    image: '/examples/airbnb-review.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/reviews/airbnb-review`,
    name: 'Airbnb / Review',
    author: 'joaom00',
  },
  {
    image: '/examples/dropbox-reset-password.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/reset-password/dropbox-reset-password`,
    name: 'Dropbox / Reset Password',
    author: 'ribeiroevandro',
  },
  {
    image: '/examples/koala-welcome.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/welcome/koala-welcome`,
    name: 'Koala / Welcome',
    author: 'nettofarah',
  },
  {
    image: '/examples/vercel-invite-user.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/notifications/vercel-invite-user`,
    name: 'Vercel / Invite User',
    author: 'zenorocha',
  },
  {
    image: '/examples/stripe-welcome.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/welcome/stripe-welcome`,
    name: 'Stripe / Welcome',
    author: 'zenorocha',
  },
  {
    image: '/examples/notion-magic-link.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/magic-links/notion-magic-link`,
    name: 'Notion / Magic Link',
    author: 'bukinoshita',
  },
  {
    image: '/examples/plaid-verify-identity.png',
    href: `${DEMO_EMAIL_PREVIEW_BASE_URL}/Community/magic-links/plaid-verify-identity`,
    name: 'Plaid / Verify Identity',
    author: 'zenorocha',
  },
];

export function TemplateList() {
  return (
    <>
      <section className="mb-24">
        <Heading
          as="h2"
          className="px-6 text-slate-12 md:px-8"
          size="3"
          weight="medium"
        >
          Official
        </Heading>
        <div className="relative grid grid-cols-1 gap-x-4 px-1 pb-10 md:grid-cols-2 md:px-0 lg:grid-cols-3">
          {officialItems.map((item, index) => (
            <Template key={item.name} index={index} {...item} />
          ))}
        </div>
      </section>

      <section>
        <Heading
          as="h2"
          className="px-6 text-slate-12 md:px-8"
          size="3"
          weight="medium"
        >
          Community
        </Heading>
        <div className="relative grid grid-cols-1 gap-x-4 px-1 pb-10 md:grid-cols-2 md:px-0 lg:grid-cols-3">
          {communityItems.map((item, index) => (
            <Template key={item.name} index={index} {...item} />
          ))}
        </div>
      </section>
    </>
  );
}
