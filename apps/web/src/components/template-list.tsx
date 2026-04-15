'use client';

import * as React from 'react';
import classNames from 'classnames';
import { Heading } from './heading';
import { Template } from './template';

interface TemplateItem {
  path: string;
  name: string;
  author?: string;
  tags: string[];
  href?: string;
}

const OFFICIAL_PREVIEW_BASE = 'https://react-email-templates-topaz.vercel.app/preview';

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildOfficialTemplates(
  theme: string,
  types: string[],
): TemplateItem[] {
  return types.map((type) => ({
    path: `${theme}/${type}`,
    name: `${titleCase(theme)} / ${titleCase(type)}`,
    tags: [type],
    href: `${OFFICIAL_PREVIEW_BASE}/${theme}/${type}`,
  }));
}

const sharedTypes = [
  'activation',
  'feature-announcement',
  'password-reset',
  'product-update',
  'subscription-confirmation',
  'subscription-update',
  'text-only',
  'welcome',
];

const ecommerceTypes = [
  'abandoned-cart',
  'activation',
  'newsletter',
  'order-confirmation',
  'order-shipping',
  'password-reset',
  'promo',
  'welcome',
];

const officialItems: TemplateItem[] = [
  ...buildOfficialTemplates('barebones', sharedTypes),
  ...buildOfficialTemplates('collage', sharedTypes),
  ...buildOfficialTemplates('dither', sharedTypes),
  ...buildOfficialTemplates('skin', ecommerceTypes),
  ...buildOfficialTemplates('tech', ecommerceTypes),
];

const communityItems: TemplateItem[] = [
  {
    path: 'magic-links/aws-verify-email',
    name: 'AWS / Verify Email',
    author: 'thecodeinfluencer',
    tags: ['magic-link'],
  },
  {
    path: 'notifications/github-access-token',
    name: 'GitHub / Access Token',
    author: 'bruno88cabral',
    tags: ['notification'],
  },
  {
    path: 'receipts/apple-receipt',
    name: 'Apple / Receipt',
    author: 'relferreira',
    tags: ['receipt'],
  },
  {
    path: 'receipts/nike-receipt',
    name: 'Nike / Receipt',
    author: 'camillegachido',
    tags: ['receipt'],
  },
  {
    path: 'newsletters/stack-overflow-tips',
    name: 'Stack Overflow / Tips',
    author: 'bruno88cabral',
    tags: ['newsletter'],
  },
  {
    path: 'magic-links/slack-confirm',
    name: 'Slack / Confirm Email',
    author: 'c0dr',
    tags: ['magic-link'],
  },
  {
    path: 'reset-password/twitch-reset-password',
    name: 'Twitch / Reset Password',
    author: 'EmersonGarrido',
    tags: ['password-reset'],
  },
  {
    path: 'magic-links/raycast-magic-link',
    name: 'Raycast / Magic Link',
    author: 'abhinandanwadwa',
    tags: ['magic-link'],
  },
  {
    path: 'notifications/yelp-recent-login',
    name: 'Yelp / Recent Login',
    author: 'EmersonGarrido',
    tags: ['notification'],
  },
  {
    path: 'magic-links/linear-login-code',
    name: 'Linear / Login Code',
    author: 'Rychillie',
    tags: ['magic-link'],
  },
  {
    path: 'newsletters/google-play-policy-update',
    name: 'Google Play / Policy Update',
    author: 'EmersonGarrido',
    tags: ['newsletter'],
  },
  {
    path: 'reviews/airbnb-review',
    name: 'Airbnb / Review',
    author: 'joaom00',
    tags: ['review'],
  },
  {
    path: 'reset-password/dropbox-reset-password',
    name: 'Dropbox / Reset Password',
    author: 'ribeiroevandro',
    tags: ['password-reset'],
  },
  {
    path: 'welcome/koala-welcome',
    name: 'Koala / Welcome',
    author: 'nettofarah',
    tags: ['welcome'],
  },
  {
    path: 'notifications/vercel-invite-user',
    name: 'Vercel / Invite User',
    author: 'zenorocha',
    tags: ['notification'],
  },
  {
    path: 'welcome/stripe-welcome',
    name: 'Stripe / Welcome',
    author: 'zenorocha',
    tags: ['welcome'],
  },
  {
    path: 'magic-links/notion-magic-link',
    name: 'Notion / Magic Link',
    author: 'bukinoshita',
    tags: ['magic-link'],
  },
  {
    path: 'magic-links/plaid-verify-identity',
    name: 'Plaid / Verify Identity',
    author: 'zenorocha',
    tags: ['magic-link'],
  },
];

const allTags = Array.from(
  new Set([
    ...officialItems.flatMap((i) => i.tags),
    ...communityItems.flatMap((i) => i.tags),
  ]),
).sort();

const TAG_LABELS: Record<string, string> = {
  'abandoned-cart': 'Abandoned Cart',
  activation: 'Activation',
  'feature-announcement': 'Feature Announcement',
  'magic-link': 'Magic Link',
  newsletter: 'Newsletter',
  notification: 'Notification',
  'order-confirmation': 'Order Confirmation',
  'order-shipping': 'Order Shipping',
  'password-reset': 'Password Reset',
  'product-update': 'Product Update',
  promo: 'Promo',
  receipt: 'Receipt',
  review: 'Review',
  subscription: 'Subscription',
  'subscription-confirmation': 'Subscription',
  'subscription-update': 'Subscription',
  'text-only': 'Text Only',
  welcome: 'Welcome',
};

function filterByTag(items: TemplateItem[], tag: string | null) {
  if (!tag) return items;
  return items.filter((item) => item.tags.includes(tag));
}

export function TemplateList() {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  const filteredOfficial = filterByTag(officialItems, activeTag);
  const filteredCommunity = filterByTag(communityItems, activeTag);

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2 px-6 md:px-0">
        <button
          className={classNames(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            activeTag === null
              ? 'border-white/20 bg-white/10 text-white'
              : 'border-slate-6 text-slate-11 hover:border-slate-8 hover:text-white',
          )}
          onClick={() => {
            setActiveTag(null);
          }}
          type="button"
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            className={classNames(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              activeTag === tag
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-slate-6 text-slate-11 hover:border-slate-8 hover:text-white',
            )}
            key={tag}
            onClick={() => {
              setActiveTag(tag);
            }}
            type="button"
          >
            {TAG_LABELS[tag] ?? titleCase(tag)}
          </button>
        ))}
      </div>

      {filteredOfficial.length > 0 ? (
        <section className="mb-12">
          <Heading
            as="h2"
            className="mb-6 px-6 text-white md:px-0"
            size="3"
            weight="medium"
          >
            Official
          </Heading>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOfficial.map((item) => (
              <Template key={item.path} {...item} />
            ))}
          </div>
        </section>
      ) : null}

      {filteredCommunity.length > 0 ? (
        <section>
          <Heading
            as="h2"
            className="mb-6 px-6 text-white md:px-0"
            size="3"
            weight="medium"
          >
            Community
          </Heading>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunity.map((item) => (
              <Template key={item.path} {...item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
