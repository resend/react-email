import { Heading } from './heading';
import { Template } from './template';

interface TemplateItem {
  path: string;
  name: string;
  author?: string;
  href?: string;
  github?: string;
  figma?: string;
  image?: string;
}

const OFFICIAL_PREVIEW_BASE =
  'https://react-email-templates-topaz.vercel.app/preview';

const GITHUB_BASE =
  'https://github.com/resend/react-email/tree/canary/apps/demo/emails';
const FIGMA_BASE = 'https://figma.com/community/file';

const officialItems: TemplateItem[] = [
  {
    path: '01-barebone',
    name: 'Barebone',
    image: '/static/templates/barebone-cover.jpeg',
    href: `${OFFICIAL_PREVIEW_BASE}/01-barebone/welcome`,
    github: `${GITHUB_BASE}/01-Barebone`,
    figma: `${FIGMA_BASE}/barebone`,
  },
  {
    path: '02-matte',
    name: 'Matte',
    image: '/static/templates/matte-cover.jpeg',
    href: `${OFFICIAL_PREVIEW_BASE}/02-matte/welcome`,
    github: `${GITHUB_BASE}/02-Matte`,
    figma: `${FIGMA_BASE}/matte`,
  },
  {
    path: '03-protocol',
    name: 'Protocol',
    image: '/static/templates/protocol-cover.jpeg',
    href: `${OFFICIAL_PREVIEW_BASE}/03-protocol/welcome`,
    github: `${GITHUB_BASE}/03-Protocol`,
    figma: `${FIGMA_BASE}/protocol`,
  },
  {
    path: '04-arcane',
    name: 'Arcane',
    image: '/static/templates/arcane-cover.jpeg',
    href: `${OFFICIAL_PREVIEW_BASE}/04-arcane/welcome`,
    github: `${GITHUB_BASE}/04-Arcane`,
    figma: `${FIGMA_BASE}/arcane`,
  },
  {
    path: '05-studio',
    name: 'Studio',
    image: '/static/templates/studio-cover.jpeg',
    href: `${OFFICIAL_PREVIEW_BASE}/05-studio/welcome`,
    github: `${GITHUB_BASE}/05-Studio`,
    figma: `${FIGMA_BASE}/studio`,
  },
];

const communityItems: TemplateItem[] = [
  {
    path: 'community/magic-links/aws-verify-email',
    name: 'AWS / Verify Email',
    author: 'thecodeinfluencer',
  },
  {
    path: 'community/notifications/github-access-token',
    name: 'GitHub / Access Token',
    author: 'bruno88cabral',
  },
  {
    path: 'community/receipts/apple-receipt',
    name: 'Apple / Receipt',
    author: 'relferreira',
  },
  {
    path: 'community/receipts/nike-receipt',
    name: 'Nike / Receipt',
    author: 'camillegachido',
  },
  {
    path: 'community/newsletters/stack-overflow-tips',
    name: 'Stack Overflow / Tips',
    author: 'bruno88cabral',
  },
  {
    path: 'community/magic-links/slack-confirm',
    name: 'Slack / Confirm Email',
    author: 'c0dr',
  },
  {
    path: 'community/reset-password/twitch-reset-password',
    name: 'Twitch / Reset Password',
    author: 'EmersonGarrido',
  },
  {
    path: 'community/magic-links/raycast-magic-link',
    name: 'Raycast / Magic Link',
    author: 'abhinandanwadwa',
  },
  {
    path: 'community/notifications/yelp-recent-login',
    name: 'Yelp / Recent Login',
    author: 'EmersonGarrido',
  },
  {
    path: 'community/magic-links/linear-login-code',
    name: 'Linear / Login Code',
    author: 'Rychillie',
  },
  {
    path: 'community/newsletters/google-play-policy-update',
    name: 'Google Play / Policy Update',
    author: 'EmersonGarrido',
  },
  {
    path: 'community/reviews/airbnb-review',
    name: 'Airbnb / Review',
    author: 'joaom00',
  },
  {
    path: 'community/reset-password/dropbox-reset-password',
    name: 'Dropbox / Reset Password',
    author: 'ribeiroevandro',
  },
  {
    path: 'community/welcome/koala-welcome',
    name: 'Koala / Welcome',
    author: 'nettofarah',
  },
  {
    path: 'community/notifications/vercel-invite-user',
    name: 'Vercel / Invite User',
    author: 'zenorocha',
  },
  {
    path: 'community/welcome/stripe-welcome',
    name: 'Stripe / Welcome',
    author: 'zenorocha',
  },
  {
    path: 'community/magic-links/notion-magic-link',
    name: 'Notion / Magic Link',
    author: 'bukinoshita',
  },
  {
    path: 'community/magic-links/plaid-verify-identity',
    name: 'Plaid / Verify Identity',
    author: 'zenorocha',
  },
];

export function TemplateList() {
  return (
    <>
      <section className="mb-24w">
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
            <Template key={item.path} index={index} {...item} />
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
            <Template key={item.path} index={index} {...item} />
          ))}
        </div>
      </section>
    </>
  );
}
