export const SOCIAL_LINKS = [
  {
    value: 'linkedin',
    label: 'LinkedIn',
    icon: 'https://resend.com/static/email/social-linkedin.png',
  },
  {
    value: 'twitter',
    label: 'X (former Twitter)',
    icon: 'https://resend.com/static/email/social-x.png',
  },
  {
    value: 'github',
    label: 'GitHub',
    icon: 'https://resend.com/static/email/social-github.png',
  },
  {
    value: 'discord',
    label: 'Discord',
    icon: 'https://resend.com/static/email/social-discord.png',
  },
  {
    value: 'slack',
    label: 'Slack',
    icon: 'https://resend.com/static/email/social-slack.png',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    icon: 'https://resend.com/static/email/social-instagram.png',
  },
  {
    value: 'facebook',
    label: 'Facebook',
    icon: 'https://resend.com/static/email/social-facebook.png',
  },
  {
    value: 'youtube',
    label: 'YouTube',
    icon: 'https://resend.com/static/email/social-youtube.png',
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    icon: 'https://resend.com/static/email/social-tiktok.png',
  },
  {
    value: 'opencollective',
    label: 'Open Collective',
    icon: 'https://resend.com/static/email/social-opencollective.png',
  },
  {
    value: 'patreon',
    label: 'Patreon',
    icon: 'https://resend.com/static/email/social-patreon.png',
  },
  {
    value: 'mastodon',
    label: 'Mastodon',
    icon: 'https://resend.com/static/email/social-mastodon.png',
  },
  {
    value: 'bluesky',
    label: 'Bluesky',
    icon: 'https://resend.com/static/email/social-bluesky.png',
  },
  {
    value: 'reddit',
    label: 'Reddit',
    icon: 'https://resend.com/static/email/social-reddit.png',
  },
  {
    value: 'pinterest',
    label: 'Pinterest',
    icon: 'https://resend.com/static/email/social-pinterest.png',
  },
] as const;

export type SocialLinkType = (typeof SOCIAL_LINKS)[number]['value'];

export type SocialLinkConfig = {
  [K in SocialLinkType]?: string;
};
